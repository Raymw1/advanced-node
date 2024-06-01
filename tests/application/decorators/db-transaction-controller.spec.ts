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
    decoratee.handle.mockResolvedValue({ statusCode: 200, data: { anyData: 'any_data' } })
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
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

  it('should call commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.commit).toHaveBeenCalledWith()
    expect(db.rollback).not.toHaveBeenCalled()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
  })

  it('should call rollback and close transaction on failure', async () => {
    decoratee.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error()
    })

    await sut.perform({ any: 'any' })

    expect(db.commit).not.toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalledTimes(1)
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
  })

  it('should return same result as decoratee', async () => {
    const httpResponse = await sut.perform({ any: 'any' })

    expect(httpResponse).toEqual({ statusCode: 200, data: { anyData: 'any_data' } })
  })
})
