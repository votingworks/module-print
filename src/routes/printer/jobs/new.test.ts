import request from 'supertest'
import mockOf from '../../../../test/utils/mockOf'
import makeApp from '../../../app'
import generateId from '../../../utils/generateId'
import fakePrintManager from '../../../../test/utils/fakePrintManager'

const generateIdMock = mockOf(generateId)

jest.mock('../../../utils/generateId')

test('rejects an empty request', async () => {
  await request(makeApp(fakePrintManager()))
    .post('/printer/jobs/new')
    .expect(400)
})

test('responds with 500 if an unhandled exception occurs', async () => {
  const printManager = fakePrintManager()

  printManager.print.mockRejectedValue(new Error('no printing!'))

  await request(makeApp(printManager))
    .post('/printer/jobs/new')
    .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect({
      errors: [
        {
          message: 'no printing!',
        },
      ],
    })
    .expect(500)
})

test('accepts an application/pdf request', async () => {
  const printManger = fakePrintManager()

  generateIdMock.mockReturnValue('abc123')
  printManger.print.mockReturnValue(Promise.resolve({ id: 'abc123' }))

  await request(makeApp(printManger))
    .post('/printer/jobs/new')
    .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect({ id: 'abc123' })
    .expect(201)

  expect(printManger.print).toHaveBeenCalledWith({
    contentType: 'application/pdf',
    content: Buffer.from([1, 2, 3]),
  })
})

test('requires content-type header', async () => {
  await request(makeApp(fakePrintManager()))
    .post('/printer/jobs/new')
    // .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect({
      errors: [
        { message: 'cannot infer print format without `Content-Type` header' },
      ],
    })
    .expect(400)
})

test('accepts a text/html request', async () => {
  const printManger = fakePrintManager()

  generateIdMock.mockReturnValue('abc123')
  printManger.print.mockReturnValue(Promise.resolve({ id: 'abc123' }))

  await request(makeApp(printManger))
    .post('/printer/jobs/new')
    .set('content-type', 'text/html')
    .set('referer', 'http://localhost:3000/review')
    .send(Buffer.from('<b>hello world!</b>'))
    .expect({ id: 'abc123' })
    .expect(201)

  expect(printManger.print).toHaveBeenCalledWith({
    contentType: 'text/html',
    content: Buffer.from('<b>hello world!</b>'),
    origin: 'http://localhost:3000',
  })
})
