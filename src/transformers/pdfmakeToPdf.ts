import * as pdfmake from 'pdfmake/build/pdfmake'
import { File } from '../manager'
import renderPDF from '../utils/renderPDF'

export const pdfmakeMimeType = 'x-application/pdfmake'

export default async function pdfmakeToPdf(input: File): Promise<File> {
  if (input.contentType !== pdfmakeMimeType) {
    return input
  }

  const document: pdfmake.TDocumentDefinitions = JSON.parse(
    new TextDecoder().decode(input.content)
  )

  return {
    content: await renderPDF(document),
    contentType: 'application/pdf',
  }
}
