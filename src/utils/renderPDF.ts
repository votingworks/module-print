import * as pdfmake from 'pdfmake/build/pdfmake'
import { inspect } from 'util'
import fonts from './fonts'
import readStream from './readStream'

import PdfPrinter = require('pdfmake')

export default async function renderPDF(
  document: pdfmake.TDocumentDefinitions
): Promise<Buffer> {
  // build the PDF from the document definition
  const printer = new PdfPrinter(fonts)
  const pdf = printer.createPdfKitDocument(document)

  pdf.end()

  // render the PDF
  const content = await readStream(pdf)

  if (!content) {
    throw new Error(
      `unable to make PDF from input document: ${inspect(document)}`
    )
  }

  return content
}
