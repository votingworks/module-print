export default function assertDefined<T>(value: T | undefined): T {
  if (typeof value === 'undefined') {
    throw new TypeError(`${value} expected to be defined`)
  }

  return value
}
