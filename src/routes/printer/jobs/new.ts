import { RequestHandler } from 'express'
import { getPrintManager, File } from '../../../manager'
import sendError from '../../../utils/sendError'
import getURLPart from '../../../utils/getURLPart'

const route: RequestHandler = async (req, res) => {
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

    res.send(await getPrintManager().print(file)).end()
  } catch (error) {
    sendError(res, error.message)
  }
}

export default route
