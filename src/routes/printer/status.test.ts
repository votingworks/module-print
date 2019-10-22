import request from 'supertest'
import makeApp from '../../app'
import fakePrintManager from '../../../test/utils/fakePrintManager'

test('responds with ok: true', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({ ok: true })
    })
    .expect(200)
})

test('responds with available print types', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({ available: expect.any(Array) })
    })
})

test('responds that text/html is available', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({
        available: expect.arrayContaining([{ contentType: 'text/html' }]),
      })
    })
})

test('responds that application/pdf is available', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({
        available: expect.arrayContaining([{ contentType: 'application/pdf' }]),
      })
    })
})

test('responds that x-application/pdfmake is available', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({
        available: expect.arrayContaining([
          { contentType: 'x-application/pdfmake', fonts: ['HelveticaNeue'] },
        ]),
      })
    })
})

test('responds that application/octet-stream is available', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect(res => {
      expect(res.body).toMatchObject({
        available: expect.arrayContaining([
          { contentType: 'application/octet-stream' },
        ]),
      })
    })
})
