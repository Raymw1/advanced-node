import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (httpRequest, httpResponse) => {
  const { statusCode, data } = await controller.handle({ ...httpRequest.body, ...httpRequest.locals })
  const json = [200, 204].includes(statusCode) ? data : { error: data.message }
  httpResponse.status(statusCode).json(json)
}
