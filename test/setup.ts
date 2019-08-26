import * as printer from 'printer'
import mockOf from './utils/mockOf'

// Always mock `printer` module so we dont' talk to the real print system.
jest.mock('printer')

mockOf(printer).getDefaultPrinterName.mockReturnValue(
  'mock-default-printer-name'
)