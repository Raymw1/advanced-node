import { UniqueId } from '@/infra/crypto'

describe('UniqueId', () => {
  it('should create a valid unique id', () => {
    const sut = new UniqueId(new Date(2021, 9, 9, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20210909101010')
  })

  it('should create a valid unique id', () => {
    const sut = new UniqueId(new Date(1989, 1, 2, 12, 0, 59))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_19890102120059')
  })
})
