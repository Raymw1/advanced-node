import { PgUser } from '@/infra/postgres/entities'
import { ConnectionNotFoundError, PgConnection } from '@/infra/postgres/helpers'

import { createConnection, getConnection, getConnectionManager } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

describe('PgConnection', () => {
  let hasSpy: jest.Mock
  let getConnectionManagerSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let releaseSpy: jest.Mock
  let commitTransactionSpy: jest.Mock
  let rollbackTransactionSpy: jest.Mock
  let getRepositorySpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let closeSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PgConnection

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    getConnectionManagerSpy = jest.fn().mockReturnValue({ has: hasSpy })
    jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    startTransactionSpy = jest.fn()
    releaseSpy = jest.fn()
    commitTransactionSpy = jest.fn()
    rollbackTransactionSpy = jest.fn()
    getRepositorySpy = jest.fn().mockReturnValue('any_repo')
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy,
      manager: { getRepository: getRepositorySpy }
    })
    createConnectionSpy = jest.fn().mockResolvedValue({ createQueryRunner: createQueryRunnerSpy })
    jest.mocked(createConnection).mockImplementation(createConnectionSpy)
    closeSpy = jest.fn()
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })
    jest.mocked(getConnection).mockImplementation(getConnectionSpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('should have only one instance', () => {
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })

  it('should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false)
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
  })

  it('should use an existing connection', async () => {
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledTimes(0)
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
  })

  it('should close connection', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledTimes(1)
    expect(closeSpy).toHaveBeenCalledWith()
  })

  it('should throw ConnectionNotFoundError on disconnect if no connection exists', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should open a transaction', async () => {
    await sut.connect()
    await sut.openTransaction()
    await sut.disconnect()

    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    expect(startTransactionSpy).toHaveBeenCalledWith()
  })

  it('should throw ConnectionNotFoundError on openTransaction if no connection exists', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should close transaction', async () => {
    await sut.connect()
    await sut.closeTransaction()
    await sut.disconnect()

    expect(releaseSpy).toHaveBeenCalledTimes(1)
    expect(releaseSpy).toHaveBeenCalledWith()
  })

  it('should throw ConnectionNotFoundError on closeTransaction if no connection exists', async () => {
    const promise = sut.openTransaction()

    expect(releaseSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should commit transaction', async () => {
    await sut.connect()
    await sut.commit()
    await sut.disconnect()

    expect(commitTransactionSpy).toHaveBeenCalledTimes(1)
    expect(commitTransactionSpy).toHaveBeenCalledWith()
  })

  it('should throw ConnectionNotFoundError on commit if no connection exists', async () => {
    const promise = sut.commit()

    expect(commitTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should rollback transaction', async () => {
    await sut.connect()
    await sut.rollback()
    await sut.disconnect()

    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1)
    expect(rollbackTransactionSpy).toHaveBeenCalledWith()
  })

  it('should throw ConnectionNotFoundError on rollback if no connection exists', async () => {
    const promise = sut.rollback()

    expect(rollbackTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('should get repository', async () => {
    await sut.connect()
    const repository = sut.getRepository(PgUser)
    await sut.disconnect()

    expect(getRepositorySpy).toHaveBeenCalledTimes(1)
    expect(getRepositorySpy).toHaveBeenCalledWith(PgUser)
    expect(repository).toBe('any_repo')
  })

  it('should throw ConnectionNotFoundError on getRepository if no connection exists', async () => {
    expect(getRepositorySpy).not.toHaveBeenCalled()
    expect(() => sut.getRepository(PgUser)).toThrow(new ConnectionNotFoundError())
  })
})
