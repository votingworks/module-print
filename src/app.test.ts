import makeApp, { getDefaultPrintManager } from './app'
import RealPrintManager from './manager/RealPrintManager'
import fakePrintManager from '../test/utils/fakePrintManager'

test('getDefaultPrintManager returns a `RealPrintManager`', () => {
  expect(getDefaultPrintManager()).toBeInstanceOf(RealPrintManager)
})

test('uses a default print manager when not given one', () => {
  expect(() => makeApp()).not.toThrowError()
})

test('can be given a print manager to use', () => {
  expect(() => makeApp(fakePrintManager())).not.toThrowError()
})
