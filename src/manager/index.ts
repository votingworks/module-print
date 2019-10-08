/* eslint-disable import/prefer-default-export */

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

export type File = HtmlFile | PdfFile | PdfMakeFile | TextFile | GenericFile

export interface HtmlFile {
  contentType: 'text/html'
  content: Buffer
  origin?: string
}

export interface PdfFile {
  contentType: 'application/pdf'
  content: Buffer
}

export interface PdfMakeFile {
  contentType: 'x-application/pdfmake'
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
  addTransform(transform: Transform): this
}
