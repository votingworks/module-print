import renderPDF from './renderPDF'
import readStream from './readStream'
import mockOf from '../../test/utils/mockOf'

jest.mock('./readStream')

const readStreamMock = mockOf(readStream)

test('renders simple PDF documents', async () => {
  readStreamMock.mockResolvedValueOnce(Buffer.of(1, 2, 3))

  expect(
    await renderPDF({
      content: [{ text: 'hello world' }],
      defaultStyle: { font: 'HelveticaNeue' },
    })
  ).toEqual(Buffer.of(1, 2, 3))
})

test('fails if no content is generated', async () => {
  readStreamMock.mockResolvedValueOnce(undefined)

  await expect(
    renderPDF({
      content: [{ text: 'hello world' }],
      defaultStyle: { font: 'HelveticaNeue' },
    })
  ).rejects.toThrowError('unable to make PDF from input document')
})
