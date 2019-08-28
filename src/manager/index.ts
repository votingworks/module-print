import { Reducer } from '../utils/reduceAsync'

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

export type File = HtmlFile | PdfFile | CsvFile | TextFile | GenericFile

export interface HtmlFile {
  contentType: 'text/html'
  content: Buffer
  origin?: string
}

export interface PdfFile {
  contentType: 'application/pdf'
  content: Buffer
}

export interface CsvFile {
  contentType: 'text/csv'
  content: Buffer
}

export interface TextFile {
  contentType: 'text/plain'
  content: Buffer
}

export interface GenericFile {
  contentType: 'application/octet-stream'
  content: Buffer
}

export type Transform = Reducer<File>

export interface PrintManager {
  print(file: File): Promise<PrintJob>
  cancel(printJob: PrintJob): Promise<PrintJobStatus>
  status(printJob: PrintJob): Promise<PrintJobStatus>
  addTransform(transform: Transform): void
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
