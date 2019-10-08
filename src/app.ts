import express from 'express'
import makeJobsNewRoute from './routes/printer/jobs/new'
import makeStatusRoute from './routes/printer/status'
import RealPrintManager from './manager/RealPrintManager'
import htmlToPdf from './transformers/htmlToPdf'
import updateBase from './transformers/updateBase'
import { PrintManager } from './manager'
import pdfmakeToPdf from './transformers/pdfmakeToPdf'

export function getDefaultPrintManager(): PrintManager {
  // Order is important:
  //   `updateBase` is HTML → HTML
  //   `htmlToPdf` is HTML → PDF
  // If you put `updateBase` after `htmlToPdf`, `updateBase` will ignore the PDF
  // input. Be careful!
  return new RealPrintManager()
    .addTransform(updateBase)
    .addTransform(htmlToPdf)
    .addTransform(pdfmakeToPdf)
}

export default function makeApp(
  printManager: PrintManager = getDefaultPrintManager()
): ReturnType<typeof express> {
  const app = express()

  // Always read request body into a Buffer.
  app.use(
    express.raw({
      type: () => true,
      limit: '10mb',
    })
  )

  app.get('/printer/status', makeStatusRoute())
  app.post('/printer/jobs/new', makeJobsNewRoute(printManager))

  return app
}
