import { Controller } from '@/application/controllers'
import { Request, Response } from 'express'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (httpRequest: Request, httpResponse: Response): Promise<void> {
    await this.controller.handle({ ...httpRequest.body })
  }
}
