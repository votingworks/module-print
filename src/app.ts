import express from 'express'
import jobsNewRoute from './routes/jobs/new'
import statusRoute from './routes/status'
import { setPrintManager } from './manager'
import RealPrintManager from './manager/RealPrintManager'

/* Printing */

setPrintManager(new RealPrintManager())

/* Server */

const app = express()

// Always read request body into a Buffer.
app.use(
  express.raw({
    type: () => true,
    limit: '10mb',
  })
)

app.get('/status', statusRoute)
app.post('/jobs/new', jobsNewRoute)

export default app
