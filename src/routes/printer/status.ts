import { RequestHandler } from 'express'

/**
 * Builds a request handler for a status endpoint.
 */
export default function makeRoute(): RequestHandler {
  return (_req, res): void => {
    res.send({ ok: true }).end()
  }
}
