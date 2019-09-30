import * as fs from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import RenderPDF from 'chrome-headless-render-pdf'
import { File } from '../manager'

const mkdtemp = promisify(fs.mkdtemp)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

/**
 * Transforms HTML to PDF by printing to PDF.
 */
export default async function htmlToPdf(input: File): Promise<File> {
  if (input.contentType !== 'text/html') {
    return input
  }

  const workingDirectory = await mkdtemp(join(tmpdir(), 'module-print-'))
  const inputPath = join(workingDirectory, 'input.html')

  await writeFile(inputPath, input.content)

  const inputURL = `file://${inputPath}`
  const content = await RenderPDF.generatePdfBuffer(inputURL)

  await unlink(inputPath)

  return {
    content,
    contentType: 'application/pdf',
  }
}
