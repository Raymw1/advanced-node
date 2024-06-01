import { DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'

export class DbTransactionController {
  constructor (
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    const { statusCode } = await this.decoratee.handle(httpRequest)
    if (statusCode >= 400) {
      await this.db.rollback()
    } else {
      await this.db.commit()
    }
    await this.db.closeTransaction()
  }
}
