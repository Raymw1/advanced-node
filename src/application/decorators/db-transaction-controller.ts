import { DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'

export class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.handle(httpRequest)
  }
}
