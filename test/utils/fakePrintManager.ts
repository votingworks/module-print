import { PrintManager } from '../../src/manager'
import { MockOf, mockNamespace } from './mockOf'

/**
 * Builds a fake print manager for use in tests.
 */
export default function fakePrintManager(): MockOf<PrintManager> {
  return mockNamespace({
    print: jest.fn(),
    cancel: jest.fn(),
    status: jest.fn(),
    addTransform: jest.fn().mockReturnThis(),
  })
}
