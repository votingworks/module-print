import request from 'supertest'
import mockOf, { MockOf } from '../../../test/utils/mockOf'
import app from '../../app'
import generateId from '../../utils/generateId'
import { resetPrintManager, setPrintManager, PrintManager } from '../../manager'

const generateIdMock = mockOf(generateId)

function mockPrintManager(): MockOf<PrintManager> {
  return {
    print: jest.fn(),
    cancel: jest.fn(),
    status: jest.fn(),
  }
}

jest.mock('../../utils/generateId')

beforeEach(() => {
  resetPrintManager()
})

test('rejects an empty request', async () => {
  await request(app)
    .post('/jobs/new')
    .expect(400)
})

test('responds with 500 if an unhandled exception occurs', async () => {
  // Unset print manager in this test so the request will fail.
  resetPrintManager()

  await request(app)
    .post('/jobs/new')
    .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect({
      errors: [
        {
          message: 'no print manager set; call `setPrintManager` to initialize',
        },
      ],
    })
    .expect(500)
})

test('accepts an application/pdf request', async () => {
  const printManger = mockPrintManager()

  setPrintManager(printManger)

  generateIdMock.mockReturnValue('abc123')
  printManger.print.mockReturnValue(Promise.resolve({ id: 'abc123' }))

  await request(app)
    .post('/jobs/new')
    .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect({ id: 'abc123' })

  expect(printManger.print).toHaveBeenCalledWith({
    contentType: 'application/pdf',
    content: Buffer.from([1, 2, 3]),
  })
})

test('requires content-type header', async () => {
  await request(app)
    .post('/jobs/new')
    // .set('content-type', 'application/pdf')
    .send(Buffer.from([1, 2, 3]))
    .expect(400, {
      errors: [
        { message: 'cannot infer print format without `Content-Type` header' },
      ],
    })
})
