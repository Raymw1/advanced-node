import { v4 } from 'uuid'
import { UUIDHandler } from '@/infra/crypto'

jest.mock('uuid')

describe('UUIDHandler', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', () => {
    jest.mocked(v4).mockReturnValueOnce('any_v4_uuid')
    const sut = new UUIDHandler()

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_v4_uuid')
  })
})
