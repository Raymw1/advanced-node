import { RequestHandler } from 'express'
import multer from 'multer'

export const adaptMulter: RequestHandler = (httpRequest, httpResponse, next) => {
  const upload = multer().single('picture')
  upload(httpRequest, httpResponse, () => {})
}
