import fakeFile from './fakeFile'
import { File } from '../../src/manager'

test('builds a `File`', () => {
  const file = fakeFile()

  expect(file.content).toBeInstanceOf(Buffer)
  expect(typeof file.contentType).toBe('string')
})

test.each<[keyof File, File[keyof File]]>([
  ['content', Buffer.from('abcdefg')],
  ['contentType', 'text/plain'],
])('can override `%s`', (key, value) => {
  expect(fakeFile({ [key]: value })[key]).toEqual(value)
})
