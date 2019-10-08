/* eslint-disable max-classes-per-file */

declare module 'pdfmake' {
  class PdfPrinter {
    constructor(fontDescriptors?: unknown)

    createPdfKitDocument(
      document: unknown,
      options?: unknown
    ): NodeJS.ReadWriteStream
  }

  export = PdfPrinter
}
