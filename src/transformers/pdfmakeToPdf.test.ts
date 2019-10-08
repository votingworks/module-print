import * as pdfmake from 'pdfmake/build/pdfmake'
import pdfmakeToPdf from './pdfmakeToPdf'
import renderPDF from '../utils/renderPDF'
import mockOf from '../../test/utils/mockOf'

jest.mock('../utils/renderPDF')
jest.mock('pdfmake')

const renderPDFMock = mockOf(renderPDF)

test('returns the input if it is not pdfmake content type', async () => {
  expect(
    await pdfmakeToPdf({
      contentType: 'text/plain',
      content: Buffer.from('hello world'),
    })
  ).toEqual({ contentType: 'text/plain', content: Buffer.from('hello world') })
})

test('interprets content as JSON and passes it to pdfmake', async () => {
  const document: pdfmake.TDocumentDefinitions = {
    content: [{ text: 'hello world' }],
    defaultStyle: {
      font: 'HelveticaNeue',
    },
  }

  renderPDFMock.mockResolvedValueOnce(Buffer.of(1, 2, 3))

  expect(
    await pdfmakeToPdf({
      contentType: 'x-application/pdfmake',
      content: Buffer.from(JSON.stringify(document)),
    })
  ).toMatchObject({
    contentType: 'application/pdf',
    content: Buffer.of(1, 2, 3),
  })

  expect(renderPDFMock.mock.calls).toMatchObject([[document]])
})

test('fails when rendering fails', async () => {
  const document: pdfmake.TDocumentDefinitions = {
    content: [{ text: 'hello world' }],
    defaultStyle: {
      font: 'HelveticaNeue',
    },
  }

  // fail to get data from PDF document
  renderPDFMock.mockRejectedValue(
    new Error('unable to make PDF from input document')
  )

  await expect(
    pdfmakeToPdf({
      contentType: 'x-application/pdfmake',
      content: Buffer.from(JSON.stringify(document)),
    })
  ).rejects.toThrowError('unable to make PDF from input document')
})
