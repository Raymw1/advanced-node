import { Middleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => async (httpRequest, httpResponse, next) => {
  const { statusCode, data } = await middleware.handle({ ...httpRequest.headers })
  if (statusCode === 200) {
    const localEntries = Object.entries(data).filter(([_key, value]) => value)
    httpRequest.locals = { ...httpRequest.locals, ...Object.fromEntries(localEntries) }
    next()
  } else {
    httpResponse.status(statusCode).send({ error: data.message })
  }
}
