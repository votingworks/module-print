import * as cp from 'child_process'
import * as fs from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { File, PdfFile } from '../manager'
import locateChrome from '../utils/locateChrome'

const mkdtemp = promisify(fs.mkdtemp)
const writeFile = promisify(fs.writeFile)
const execFile = promisify(cp.execFile)
const readFile = promisify(fs.readFile)
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

  await execFile(
    await locateChrome(),
    ['--headless', '--disable-gpu', '--print-to-pdf', inputPath],
    { cwd: workingDirectory }
  )

  const outputPath = join(workingDirectory, 'output.pdf')
  const file: PdfFile = {
    content: await readFile(outputPath),
    contentType: 'application/pdf',
  }

  await unlink(inputPath)
  await unlink(outputPath)

  return file
}
