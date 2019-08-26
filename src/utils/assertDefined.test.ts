import assertDefined from './assertDefined'

test('returns the value if it is not `undefined`', () => {
  expect(assertDefined(0)).toBe(0)
})

test('throws if the value is `undefined`', () => {
  expect(() => assertDefined(undefined)).toThrow(
    'undefined expected to be defined'
  )
})
