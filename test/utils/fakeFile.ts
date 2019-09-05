import { File } from '../../src/manager'

export default function fakeFile({
  contentType = 'application/octet-stream',
  content = Buffer.from([]),
  ...rest
}: Partial<File> = {}): File {
  return {
    contentType,
    content,
    ...rest,
  }
}
