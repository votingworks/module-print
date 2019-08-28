import getURLPart from './getURLPart'

test.each<[keyof URL, URL[keyof URL]]>([
  ['host', 'example.com'],
  ['origin', 'https://example.com'],
  ['search', '?foo=bar'],
  ['hash', '#fragment'],
])('can get %s from a URL', (part, value) => {
  expect(
    getURLPart('https://example.com/path/part?foo=bar#fragment', part)
  ).toEqual(value)
})

test('returns undefined when given undefined', () => {
  expect(getURLPart(undefined, 'host')).toBeUndefined()
})
