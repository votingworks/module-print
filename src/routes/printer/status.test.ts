import request from 'supertest'
import makeApp from '../../app'
import fakePrintManager from '../../../test/utils/fakePrintManager'

test('responds with ok: true', async () => {
  await request(makeApp(fakePrintManager()))
    .get('/printer/status')
    .expect({ ok: true })
    .expect(200)
})
