/**
 * Asserts that `value` is defined and returns it, unwrapping a
 * possibly-undefined type. This is similar to the non-null assertion operator
 * in TypeScript but this will actually throw at runtime.
 */
export default function assertDefined<T>(value: T | undefined): T {
  if (typeof value === 'undefined') {
    throw new TypeError(`${value} expected to be defined`)
  }

  return value
}
