import {
  printDirect,
  setJob,
  getPrinter,
  getDefaultPrinterName,
  PrintJob as RealPrintJob,
  PrintFormat,
} from 'printer'
import uuid from 'uuid/v1'
import {
  PrintManager,
  PrintJob,
  PrintJobStatus,
  PrintJobState,
  File,
} from './index'
import assertDefined from '../utils/assertDefined'

const printFormatByContentType = new Map<string, PrintFormat>([
  ['application/pdf', 'PDF'],
  ['image/jpeg', 'JPEG'],
  ['text/plain', 'TEXT'],
  ['application/postscript', 'POSTSCRIPT'],
  ['application/octet-stream', 'RAW'],
])

const DefaultPrintFormat: PrintFormat = 'AUTO'

const printJobStateByRealPrintStatus = new Map<
  RealPrintJob['status'][0],
  PrintJobState
>([
  ['ABORTED', PrintJobState.Canceled],
  ['CANCELLED', PrintJobState.Canceled],
  ['PAUSED', PrintJobState.Paused],
  ['PENDING', PrintJobState.Pending],
  ['PRINTING', PrintJobState.Printing],
  ['PRINTED', PrintJobState.Success],
])

const DefaultPrintJobState = PrintJobState.Unknown

export default class RealPrintManager implements PrintManager {
  constructor(
    private readonly printerName: string = assertDefined(
      getDefaultPrinterName()
    ),
    private readonly makeId: typeof uuid = uuid
  ) {}

  async print(file: File): Promise<PrintJob> {
    const id = this.makeId()

    printDirect({
      data: file.content,
      printer: this.printerName,
      docname: id,
      type: RealPrintManager.getPrintFormatForContentType(file.contentType),
      success() {
        /* nothing to do */
      },
      error(error) {
        throw error
      },
    })

    return { id }
  }

  static getPrintFormatForContentType(contentType: string): PrintFormat {
    return printFormatByContentType.get(contentType) || DefaultPrintFormat
  }

  async cancel(printJob: PrintJob): Promise<PrintJobStatus> {
    setJob(this.printerName, this.getRealPrintJob(printJob.id).id, 'CANCEL')
    return this.status(printJob)
  }

  static getStateForRealPrintStatus(
    realStatuses: RealPrintJob['status']
  ): PrintJobState {
    return (
      printJobStateByRealPrintStatus.get(realStatuses[0]) ||
      DefaultPrintJobState
    )
  }

  async status(printJob: PrintJob): Promise<PrintJobStatus> {
    return {
      state: RealPrintManager.getStateForRealPrintStatus(
        this.getRealPrintJob(printJob.id).status
      ),
    }
  }

  getRealPrintJob(id: string): RealPrintJob {
    const job = getPrinter(this.printerName).jobs.find(
      element => element.name === id
    )

    if (!job) {
      throw new Error(`unable to find job with id=${id}`)
    }

    return job
  }
}