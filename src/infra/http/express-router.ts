import { Controller } from '@/application/controllers'
import { Request, Response } from 'express'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (httpRequest: Request, httpResponse: Response): Promise<void> {
    const response = await this.controller.handle({ ...httpRequest.body })
    httpResponse.status(200).json(response.data)
  }
}
