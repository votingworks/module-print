import { ReadableStreamBuffer } from 'stream-buffers'
import readStream from './readStream'

test('consumes a readable stream', async () => {
  const stream = new ReadableStreamBuffer()
  stream.put('a b c')
  stream.stop()

  expect(await readStream(stream)).toEqual(Buffer.from('a b c'))
})

test('defaults to undefined if there are no contents', async () => {
  const stream = new ReadableStreamBuffer()
  stream.stop()

  expect(await readStream(stream)).toEqual(undefined)
})
