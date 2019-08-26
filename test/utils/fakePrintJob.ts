import { PrintJob } from 'printer'

export default function fakePrintJob({
  id = 0,
  name = `mock-print-job-${id}`,
  printerName = 'my-printer',
  user = 'printy',
  format = 'AUTO',
  priority = 0,
  size = 0,
  status = [],
  completedTime = new Date(0),
  creationTime = new Date(0),
  processingTime = new Date(0),
}: Partial<PrintJob> = {}): PrintJob {
  return {
    id,
    name,
    printerName,
    user,
    format,
    priority,
    size,
    status,
    completedTime,
    creationTime,
    processingTime,
  }
}
