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
    createQueryRunnerSpy = jest.fn().mockReturnValue({ startTransaction: startTransactionSpy })
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

    expect(startTransactionSpy).toHaveBeenCalledTimes(1)
    expect(startTransactionSpy).toHaveBeenCalledWith()
  })
})
