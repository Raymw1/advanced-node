import { ServerError } from '@/application/errors'
import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (httpRequest, httpResponse, next) => {
  const upload = multer().single('picture')
  upload(httpRequest, httpResponse, (error) => {
    httpResponse.status(500).json({ error: new ServerError(error).message })
  })
}
