import * as printerLib from 'printer'
import uuid from 'uuid/v1'
import fakeFile from '../../test/utils/fakeFile'
import mockOf from '../../test/utils/mockOf'
import RealPrintManager from './RealPrintManager'
import { PrintJobState } from '.'
import fakePrinter from '../../test/utils/fakePrinter'
import fakePrintJob from '../../test/utils/fakePrintJob'

jest.mock('uuid/v1')

const uuidMock = mockOf(uuid)
const printerMock = mockOf(printerLib)

printerMock.getDefaultPrinterName.mockReturnValue('my-printer')

test('prints by calling `printDirect` with the data provided', async () => {
  const printer = fakePrinter()
  const manager = new RealPrintManager(printer.name, uuid)
  const file = fakeFile()

  uuidMock.mockReturnValue('abc123')

  printerMock.printDirect.mockImplementation(
    ({
      data,
      printer: printerName,
      docname,
      type,
      options,
      success,
      error,
    }) => {
      expect(data).toBe(file.content)
      expect(printerName).toBe(printer.name)
      expect(docname).toBe('abc123')
      expect(type).toBe('RAW')
      expect(options).toBeUndefined()
      expect(success).toBeInstanceOf(Function)
      expect(error).toBeInstanceOf(Function)

      // Call `success` callback immediately just as `printDirect` would.
      success(42)
    }
  )

  expect(await manager.print(file)).toEqual({ id: 'abc123' })
})

test('propagates a thrown error', async () => {
  const printer = fakePrinter()
  const manager = new RealPrintManager(printer.name, uuid)

  uuidMock.mockReturnValue('abc123')

  printerMock.printDirect.mockImplementation(({ error }) => {
    error(new Error('nope!'))
  })

  expect(manager.print(fakeFile())).rejects.toThrow('nope!')
})

test('can get the status with linked CUPS job id with our own id', async () => {
  const printer = fakePrinter({
    jobs: [
      fakePrintJob({
        name: 'abc123',
        status: ['PRINTING'],
      }),
    ],
  })
  const manager = new RealPrintManager(printer.name)

  printerMock.getPrinter.mockReturnValue(printer)

  expect(await manager.status({ id: 'abc123' })).toEqual({
    state: PrintJobState.Printing,
  })
})

test.each<[printerLib.PrinterStatus, PrintJobState]>([
  ['ABORTED', PrintJobState.Canceled],
  ['CANCELLED', PrintJobState.Canceled],
  ['PAUSED', PrintJobState.Paused],
  ['PENDING', PrintJobState.Pending],
  ['PRINTED', PrintJobState.Success],
  ['PRINTING', PrintJobState.Printing],
  ['UNEXPECTED VALUE' as printerLib.PrinterStatus, PrintJobState.Unknown],
])('maps CUPS %s to PrintJobState.%s', (cupsStatus, expected) => {
  expect(RealPrintManager.getStateForRealPrintStatus([cupsStatus])).toEqual(
    expected
  )
})

test.each<[string, printerLib.PrintFormat]>([
  ['application/pdf', 'PDF'],
  ['image/jpeg', 'JPEG'],
  ['application/x-what-even-is-this', 'AUTO'],
])('maps mime type %s to print format %s', (mimeType, printFormat) => {
  expect(RealPrintManager.getPrintFormatForContentType(mimeType)).toEqual(
    printFormat
  )
})

test('can cancel a job by sending the CANCEL command', async () => {
  const printJob = fakePrintJob({
    name: 'abc123',
    status: ['PRINTING'],
  })
  const printer = fakePrinter({
    jobs: [printJob],
  })
  const manager = new RealPrintManager(printer.name)

  printerMock.getPrinter.mockReturnValue(printer)

  await manager.cancel({ id: 'abc123' })

  expect(printerMock.setJob).toHaveBeenCalledWith(
    printer.name,
    printJob.id,
    'CANCEL'
  )
})

test('throws when trying to cancel a job that does not exist', async () => {
  const printer = fakePrinter()
  const manager = new RealPrintManager(printer.name)

  printerMock.getPrinter.mockReturnValue(printer)

  expect(manager.cancel({ id: 'abc123' })).rejects.toThrow(
    'unable to find job with id=abc123'
  )
})
