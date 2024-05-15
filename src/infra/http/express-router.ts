import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (httpRequest, httpResponse) => {
    const response = await controller.handle({ ...httpRequest.body })
    if (response.statusCode === 200) {
      httpResponse.status(200).json(response.data)
    } else {
      httpResponse.status(response.statusCode).json({ error: response.data.message })
    }
  }
}
