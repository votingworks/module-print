import { RequestHandler } from 'express'

const route: RequestHandler = (_req, res) => {
  res.send({ ok: true }).end()
}

export default route
