import { getPrintManager } from '.'

test('`getPrintManager` throws if nothing has been set', () => {
  expect(() => getPrintManager()).toThrow(
    'no print manager set; call `setPrintManager` to initialize'
  )
})
