import express from 'express'
import jobsNewRoute from './routes/printer/jobs/new'
import statusRoute from './routes/printer/status'
import { setPrintManager } from './manager'
import RealPrintManager from './manager/RealPrintManager'
import htmlToPdf from './transformers/htmlToPdf'
import updateBase from './transformers/updateBase'

/* Printing */

setPrintManager(
  // Order is important:
  //   `updateBase` is HTML → HTML
  //   `htmlToPdf` is HTML → PDF
  // If you put `updateBase` after `htmlToPdf`, `updateBase` will ignore the PDF
  // input. Be careful!
  new RealPrintManager().addTransform(updateBase).addTransform(htmlToPdf)
)

/* Server */

const app = express()

// Always read request body into a Buffer.
app.use(
  express.raw({
    type: () => true,
    limit: '10mb',
  })
)

app.get('/printer/status', statusRoute)
app.post('/printer/jobs/new', jobsNewRoute)

export default app
