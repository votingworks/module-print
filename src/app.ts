import express from 'express'
import jobsNewRoute from './routes/jobs/new'
import { setPrintManager } from './manager'
import RealPrintManager from './manager/RealPrintManager'

/** ********* */
/* Printing */
/** ********* */

setPrintManager(new RealPrintManager())

/** ******* */
/* Server */
/** ******* */

const app = express()

app.use(
  express.raw({
    type: () => true,
    limit: '10mb',
  })
)
app.post('/jobs/new', jobsNewRoute)

export default app
