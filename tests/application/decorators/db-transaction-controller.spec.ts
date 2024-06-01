import { DbTransaction } from '@/application/contracts'
import { DbTransactionController } from '@/application/decorators'
import { mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  it('should open transaction', async () => {
    const db = mock<DbTransaction>()
    const sut = new DbTransactionController(db)

    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledTimes(1)
    expect(db.openTransaction).toHaveBeenCalledWith()
  })
})
