declare module 'printer' {
  export interface Printer {
    name: string
    isDefault: boolean
    options: PrintOptions
    jobs: Array<PrintJob>
  }

  export interface PrintOptions {
    [key: string]: string
  }

  export type PrinterStatus =
    | 'PRINTING'
    | 'PRINTED'
    | 'PAUSED'
    | 'PENDING'
    | 'CANCELLED'
    | 'ABORTED'

  export interface PrintJob {
    id: number
    name: string
    printerName: string
    user: string
    format: PrintFormat
    priority: number
    size: number
    status: PrinterStatus[]
    // new Date(0) is used instead of `undefined`
    completedTime: Date
    creationTime: Date
    processingTime: Date
  }

  export type PrintFormat =
    | 'RAW'
    | 'TEXT'
    | 'PDF'
    | 'JPEG'
    | 'POSTSCRIPT'
    | 'COMMAND'
    | 'AUTO'

  /**
   * Return all installed printers including active jobs.
   */
  export function getPrinters(): Array<Printer>

  /**
   * Get printer info with jobs.
   */
  export function getPrinter(printerName: string): Printer

  /**
   * Prints directly from memory.
   */
  function printDirect(
    data: string | Buffer,
    printer?: string,
    docname?: string,
    type?: PrintFormat,
    options?: PrintOptions,
    success: (jobId: PrintJob['id']) => void,
    error: (error: Error) => void
  ): void
  function printDirect(parameters: {
    data: string | Buffer
    printer?: string
    docname?: string
    type?: PrintFormat
    options?: PrintOptions
    success: (jobId: PrintJob['id']) => void
    error: (error: Error) => void
  }): void

  export { printDirect }

  export interface PrintFileParameters {
    filename: string
    docname?: string
    printer?: string
    options?: PrintOptions
    success?: (jobId: PrintJob['id']) => void
    error?: (error: Error) => void
  }

  export type JobCommand = 'CANCEL'

  /**
   * Send file to printer.
   */
  export function printFile(parameters: PrintFileParameters): void

  /**
   * Return default printer name.
   */
  export function getDefaultPrinterName(): string | undefined

  /**
   * Get supported print format for printDirect.
   */
  export function getSupportedPrintFormats(): PrintFormat[]

  /**
   * Get possible job command for setJob. It depends on os.
   */
  export function getSupportedJobCommands(): JobCommand[]

  /**
   * Finds selected paper size pertaining to the specific printer out of all supported ones in driver_options.
   */
  export function getSelectedPaperSize(printerName?: string): string

  /**
   * Get printer driver options includes advanced options like supported paper size.
   */
  export function getPrinterDriverOptions(printerName?: string): PrintOptions

  /**
   * Get printer job info object.
   */
  export function getJob(printerName: string, jobId: PrintJob['id']): PrintJob

  /**
   * Sends a command to the printer for a specific job.
   */
  export function setJob(
    printerName: string,
    jobId: PrintJob['id'],
    command: JobCommand
  ): boolean
}
