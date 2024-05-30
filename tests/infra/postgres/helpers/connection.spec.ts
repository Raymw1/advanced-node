import { PgConnection } from '@/infra/postgres/helpers'
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
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let sut: PgConnection

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(false)
    getConnectionManagerSpy = jest.fn().mockReturnValue({ has: hasSpy })
    jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn()
    createConnectionSpy = jest.fn().mockResolvedValue({ createQueryRunner: createQueryRunnerSpy })
    jest.mocked(createConnection).mockImplementation(createConnectionSpy)
    getConnectionSpy = jest.fn().mockReturnValue({ createQueryRunner: createQueryRunnerSpy })
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
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
  })

  it('should use an existing connection', async () => {
    hasSpy.mockReturnValueOnce(true)
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledTimes(0)
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
  })
})
