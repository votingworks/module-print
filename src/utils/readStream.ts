import { WritableStreamBuffer } from 'stream-buffers'

export default async function readStream(
  input: NodeJS.ReadableStream
): Promise<Buffer | undefined> {
  const writeStream = new WritableStreamBuffer()
  const stream = input.pipe(writeStream)

  return new Promise<Buffer | undefined>((resolve): void => {
    stream.on('finish', () => resolve(writeStream.getContents() || undefined))
  })
}
