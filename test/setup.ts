import * as printer from 'printer'
import mockOf from './utils/mockOf'
import { File } from '../src/manager'

declare global {
  // eslint-disable-next-line no-redeclare, @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualFile(file: File): R
    }
  }
}

expect.extend({
  toEqualFile(actual: File, expected: File): jest.CustomMatcherResult {
    return {
      pass:
        expected.contentType === actual.contentType &&
        expected.content.equals(actual.content),
      message: (): string =>
        this.utils.diff(
          {
            contentType: expected.contentType,
            content: expected.content.toString('utf8'),
          },
          {
            contentType: actual.contentType,
            content: actual.content.toString('utf8'),
          }
        ) || '',
    }
  },
})

// Always mock `printer` module so we don't talk to the real print system.
jest.mock('printer')

beforeEach(() => {
  mockOf(printer).getDefaultPrinterName.mockReturnValue(
    'mock-default-printer-name'
  )
})
