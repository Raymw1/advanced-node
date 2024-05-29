import { ServerError } from '@/application/errors'
import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (httpRequest, httpResponse, next) => {
  const upload = multer().single('picture')
  upload(httpRequest, httpResponse, (error) => {
    if (error !== undefined) {
      return httpResponse.status(500).json({ error: new ServerError(error).message })
    }
    if (httpRequest.file !== undefined) {
      httpRequest.locals = {
        ...httpRequest.locals,
        file: { buffer: httpRequest.file.buffer, mimeType: httpRequest.file.mimetype }
      }
    }
  })
}
