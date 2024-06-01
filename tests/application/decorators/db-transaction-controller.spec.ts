import { DbTransaction } from '@/application/contracts'
import { DbTransactionController } from '@/application/decorators'

import { MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock<DbTransaction>()
  })

  beforeEach(() => {
    sut = new DbTransactionController(db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledTimes(1)
    expect(db.openTransaction).toHaveBeenCalledWith()
  })
})
