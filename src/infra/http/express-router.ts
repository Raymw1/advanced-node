import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (httpRequest, httpResponse) => {
  const { statusCode, data } = await controller.handle({ ...httpRequest.body })
  const json = statusCode === 200 ? data : { error: data.message }
  httpResponse.status(statusCode).json(json)
}
