export interface PrintJob {
  readonly id: string
}

export enum PrintJobState {
  Preparing = 'Preparing',
  Queuing = 'Queuing',
  Pending = 'Pending',
  Paused = 'Paused',
  Printing = 'Printing',
  Error = 'Error',
  Success = 'Success',
  Canceled = 'Canceled',
  Unknown = 'Unknown',
}

export interface PrintJobStatus {
  readonly state: PrintJobState
}

export interface File {
  contentType: string
  content: Buffer
}

export interface PrintManager {
  print(file: File): Promise<PrintJob>
  cancel(printJob: PrintJob): Promise<PrintJobStatus>
  status(printJob: PrintJob): Promise<PrintJobStatus>
}

let printManager: PrintManager | undefined

export function getPrintManager(): PrintManager {
  if (!printManager) {
    throw new Error(
      'no print manager set; call `setPrintManager` to initialize'
    )
  }
  return printManager
}

export function setPrintManager(value: PrintManager): void {
  printManager = value
}

export function resetPrintManager(): void {
  printManager = undefined
}
