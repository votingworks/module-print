import { RequestHandler } from 'express'
import fonts from '../../utils/fonts'

/**
 * Builds a request handler for a status endpoint.
 */
export default function makeRoute(): RequestHandler {
  return (_req, res): void => {
    res
      .send({
        ok: true,
        available: [
          {
            contentType: 'text/html',
          },
          {
            contentType: 'application/pdf',
          },
          {
            contentType: 'x-application/pdfmake',
            fonts: Object.getOwnPropertyNames(fonts),
          },
          {
            contentType: 'application/octet-stream',
          },
        ],
      })
      .end()
  }
}
