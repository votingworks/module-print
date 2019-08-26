import { RequestHandler } from 'express'
import { getPrintManager } from '../../manager'
import sendError from '../../utils/sendError'

const route: RequestHandler = async (req, res) => {
  try {
    const content = req.body

    if (!Buffer.isBuffer(content) || content.length === 0) {
      sendError(res, 'missing request body', 400)
      return
    }

    const contentType = req.get('content-type')

    if (!contentType) {
      sendError(
        res,
        'cannot infer print format without `Content-Type` header',
        400
      )
      return
    }

    res.send(await getPrintManager().print({ contentType, content })).end()
  } catch (error) {
    sendError(res, error.message)
  }
}

export default route
