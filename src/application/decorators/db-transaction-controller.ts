import { DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'

export class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<HttpResponse> {
    await this.db.openTransaction()
    const { statusCode, data } = await this.decoratee.handle(httpRequest)
    if (statusCode >= 400) {
      await this.db.rollback()
    } else {
      await this.db.commit()
    }
    await this.db.closeTransaction()
    return { statusCode, data }
  }
}
