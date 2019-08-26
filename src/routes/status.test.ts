import request from 'supertest'
import app from '../app'

test('responds with ok: true', async () => {
  await request(app)
    .get('/status')
    .expect(200, { ok: true })
})
