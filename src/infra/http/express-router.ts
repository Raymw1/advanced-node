import { Controller } from '@/application/controllers'
import { Request, Response } from 'express'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (httpRequest: Request, httpResponse: Response): Promise<void> {
    const response = await this.controller.handle({ ...httpRequest.body })
    if (response.statusCode === 200) {
      httpResponse.status(200).json(response.data)
    } else {
      httpResponse.status(response.statusCode).json({ error: response.data.message })
    }
  }
}
