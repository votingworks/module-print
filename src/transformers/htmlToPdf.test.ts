import { execFile, ChildProcess } from 'child_process'
import { mkdtemp, readFile, writeFile, unlink } from 'fs'
import locateChrome from '../utils/locateChrome'
import mockOf from '../../test/utils/mockOf'
import htmlToPdf from './htmlToPdf'
import fakeFile from '../../test/utils/fakeFile'

const mockChromeLocation = 'chrome'

jest.mock('chrome-location')
jest.mock('child_process')
jest.mock('fs')
jest.mock('../utils/locateChrome')

const execFileMock = mockOf(execFile)
const mkdtempMock = mockOf(mkdtemp)
const readFileMock = mockOf(readFile)
const writeFileMock = mockOf(writeFile)
const unlinkMock = mockOf(unlink)
const locateChromeMock = mockOf(locateChrome)

beforeEach(() => {
  execFileMock.mockReset()
  mkdtempMock.mockReset()
  readFileMock.mockReset()
  writeFileMock.mockReset()
  unlinkMock.mockReset()
  locateChromeMock.mockReset()
})

test('converts text/html to application/pdf by calling Chrome with --print-to-pdf and the HTML in a temp file', async () => {
  locateChromeMock.mockResolvedValue(mockChromeLocation)

  mkdtempMock.mockImplementation((_prefix, callback) =>
    // eslint-disable-next-line no-null/no-null
    callback(null, '/tmp/module-print-123456')
  )

  readFileMock.mockImplementation((path, callback) => {
    expect(path).toEqual('/tmp/module-print-123456/output.pdf')
    // eslint-disable-next-line no-null/no-null
    callback(null, Buffer.from([25, 50, 44]))
  })

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

  execFileMock.mockImplementation(
    (file, args, options, callback): ChildProcess => {
      expect(file).toEqual(mockChromeLocation)
      expect(args).toEqual([
        '--headless',
        '--disable-gpu',
        '--print-to-pdf',
        '/tmp/module-print-123456/input.html',
      ])

      expect(options).toEqual({ cwd: '/tmp/module-print-123456' })

      if (callback) {
        // eslint-disable-next-line no-null/no-null
        callback(null, '', '')
      }

      return ({} as unknown) as ChildProcess
    }
  )

  const input = fakeFile({
    content: Buffer.from('<b>hello world!</b>'),
    contentType: 'text/html',
  })

  expect(await htmlToPdf(input)).toEqual(
    fakeFile({
      content: Buffer.from([25, 50, 44]),
      contentType: 'application/pdf',
    })
  )

  expect(unlinkMock).toHaveBeenCalledTimes(2)
  expect(unlinkMock).toHaveBeenNthCalledWith(
    1,
    '/tmp/module-print-123456/input.html',
    expect.any(Function)
  )
  expect(unlinkMock).toHaveBeenNthCalledWith(
    2,
    '/tmp/module-print-123456/output.pdf',
    expect.any(Function)
  )
})

test('ignores files with content type other than text/html', async () => {
  expect(mkdtempMock).toBeCalledTimes(0)
  expect(readFileMock).toBeCalledTimes(0)
  expect(writeFileMock).toBeCalledTimes(0)
  expect(execFileMock).toBeCalledTimes(0)

  const input = fakeFile({ contentType: 'application/pdf' })

  expect(await htmlToPdf(input)).toBe(input)
})
