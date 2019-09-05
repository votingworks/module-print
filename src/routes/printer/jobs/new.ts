import { RequestHandler } from 'express'
import { File, PrintManager } from '../../../manager'
import sendError from '../../../utils/sendError'
import getURLPart from '../../../utils/getURLPart'

/**
 * Builds a request handler for creating new print jobs.
 */
export default function makeRoute(printManager: PrintManager): RequestHandler {
  return async (req, res): Promise<void> => {
    try {
      const content = req.body

      if (!Buffer.isBuffer(content) || content.length === 0) {
        sendError(res, 'missing request body', 400)
        return
      }

      const contentType = req.get('content-type')
      let file: File

      if (!contentType) {
        sendError(
          res,
          'cannot infer print format without `Content-Type` header',
          400
        )
        return
      }

      if (contentType === 'text/html') {
        file = {
          contentType,
          content,
          origin: getURLPart(req.get('referer'), 'origin'),
        }
      } else {
        file = { contentType: contentType as File['contentType'], content }
      }

      res
        .status(201)
        .send(await printManager.print(file))
        .end()
    } catch (error) {
      sendError(res, error.message)
    }
  }
}
