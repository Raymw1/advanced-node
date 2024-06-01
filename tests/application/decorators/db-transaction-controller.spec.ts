import { DbTransaction } from '@/application/contracts'
import { Controller } from '@/application/controllers'
import { DbTransactionController } from '@/application/decorators'

import { MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock<DbTransaction>()
    decoratee = mock<Controller>()
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledTimes(1)
    expect(db.openTransaction).toHaveBeenCalledWith()
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.handle).toHaveBeenCalledTimes(1)
    expect(decoratee.handle).toHaveBeenCalledWith({ any: 'any' })
  })
})
