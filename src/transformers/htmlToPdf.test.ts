import { mkdtemp, readFile, writeFile, unlink } from 'fs'
import RenderPDF from 'chrome-headless-render-pdf'
import mockOf from '../../test/utils/mockOf'
import htmlToPdf from './htmlToPdf'
import fakeFile from '../../test/utils/fakeFile'

jest.mock('chrome-headless-render-pdf')
jest.mock('fs')

const mkdtempMock = mockOf(mkdtemp)
const readFileMock = mockOf(readFile)
const writeFileMock = mockOf(writeFile)
const unlinkMock = mockOf(unlink)
const RenderPDFMock = mockOf(RenderPDF)

test('converts text/html to application/pdf using chrome-headless-render-pdf', async () => {
  mkdtempMock.mockImplementation((_prefix, callback) =>
    // eslint-disable-next-line no-null/no-null
    callback(null, '/tmp/module-print-123456')
  )

  writeFileMock.mockImplementation((path, data, callback) => {
    expect(path).toEqual('/tmp/module-print-123456/input.html')
    expect(data).toEqual(Buffer.from('<b>hello world!</b>'))
    // eslint-disable-next-line no-null/no-null
    callback(null)
  })

  unlinkMock.mockImplementation((_path, callback) => {
    // eslint-disable-next-line no-null/no-null
    callback(null)
  })

  RenderPDFMock.generatePdfBuffer.mockResolvedValue(Buffer.of(25, 50, 44))

  const input = fakeFile({
    content: Buffer.from('<b>hello world!</b>'),
    contentType: 'text/html',
  })

  expect(await htmlToPdf(input)).toEqual(
    fakeFile({
      content: Buffer.of(25, 50, 44),
      contentType: 'application/pdf',
    })
  )

  expect(unlinkMock).toHaveBeenCalledWith(
    '/tmp/module-print-123456/input.html',
    expect.any(Function)
  )

  expect(RenderPDFMock.generatePdfBuffer).toHaveBeenCalledWith(
    'file:///tmp/module-print-123456/input.html'
  )
})

test('ignores files with content type other than text/html', async () => {
  expect(mkdtempMock).toBeCalledTimes(0)
  expect(readFileMock).toBeCalledTimes(0)
  expect(writeFileMock).toBeCalledTimes(0)
  expect(RenderPDFMock).toBeCalledTimes(0)

  const input = fakeFile({ contentType: 'application/pdf' })

  expect(await htmlToPdf(input)).toBe(input)
})
