import { Middleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => async (httpRequest, httpResponse, next) => {
  await middleware.handle({ ...httpRequest.headers })
}
