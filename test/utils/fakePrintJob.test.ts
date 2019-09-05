import { PrintJob } from 'printer'
import fakePrintJob from './fakePrintJob'

test('builds a fake print job', () => {
  const printJob = fakePrintJob()

  expect(typeof printJob.id).toBe('number')
  expect(typeof printJob.name).toBe('string')
  expect(typeof printJob.printerName).toBe('string')
  expect(typeof printJob.user).toBe('string')
  expect(typeof printJob.format).toBe('string')
  expect(typeof printJob.priority).toBe('number')
  expect(typeof printJob.size).toBe('number')
  expect(printJob.status).toBeInstanceOf(Array)
  expect(printJob.completedTime).toBeInstanceOf(Date)
  expect(printJob.creationTime).toBeInstanceOf(Date)
  expect(printJob.processingTime).toBeInstanceOf(Date)
})

test.each<[keyof PrintJob, PrintJob[keyof PrintJob]]>([
  ['id', 42],
  ['name', 'my-ballot'],
  ['printerName', 'pc-load-letter'],
  ['user', 'beep-boop'],
  ['format', 'PDF'],
  ['priority', 99],
  ['size', 8765],
  ['status', ['PAUSED']],
  ['completedTime', new Date()],
  ['creationTime', new Date()],
  ['processingTime', new Date()],
])('can override `%s`', (key, value) => {
  expect(fakePrintJob({ [key]: value })[key]).toEqual(value)
})
