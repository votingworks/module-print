import updateBase from './updateBase'
import fakeFile from '../../test/utils/fakeFile'

test('ignores non-HTML input', async () => {
  const file = fakeFile({ contentType: 'application/pdf' })

  expect(await updateBase(file)).toBe(file)
})

test('ignores HTML files without an origin', async () => {
  const file = fakeFile({ contentType: 'text/html', origin: undefined })

  expect(await updateBase(file)).toBe(file)
})

test('resets the base href to the origin server', async () => {
  const file = fakeFile({
    contentType: 'text/html',
    content: Buffer.from('<img src="/Sample-Seal.svg" />'),
    origin: 'http://localhost:3000',
  })

  expect(await updateBase(file)).toEqualFile({
    contentType: 'text/html',
    content: Buffer.from(
      '<html><head><base href="http://localhost:3000"></head><body><img src="/Sample-Seal.svg"></body></html>'
    ),
  })
})

test('does not modify an existing base href attribute', async () => {
  const file = fakeFile({
    contentType: 'text/html',
    content: Buffer.from('<base href="http://example.com">'),
    origin: 'http://localhost:3000',
  })

  expect(await updateBase(file)).toEqualFile({
    contentType: 'text/html',
    content: Buffer.from(
      '<html><head><base href="http://example.com"></head><body></body></html>'
    ),
  })
})

test('adds a missing href to an existing base element', async () => {
  const file = fakeFile({
    contentType: 'text/html',
    content: Buffer.from('<base target="_self">'),
    origin: 'http://localhost:3000',
  })

  expect(await updateBase(file)).toEqualFile({
    contentType: 'text/html',
    content: Buffer.from(
      '<html><head><base target="_self" href="http://localhost:3000"></head><body></body></html>'
    ),
  })
})
