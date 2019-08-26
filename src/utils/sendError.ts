import { Response } from 'express'

export default function sendError(
  res: Response,
  message: string,
  statusCode = 500
): void {
  res
    .status(statusCode)
    .send({
      errors: [
        {
          message,
        },
      ],
    })
    .end()
}
