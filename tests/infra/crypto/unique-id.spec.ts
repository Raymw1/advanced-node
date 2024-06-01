import { UniqueId } from '@/infra/crypto'

import mockdate from 'mockdate'

describe('UniqueId', () => {
  let sut: UniqueId

  beforeEach(() => {
    sut = new UniqueId()
  })

  afterEach(() => {
    mockdate.reset()
  })

  it('should create a valid unique id', () => {
    mockdate.set(new Date(2021, 9, 9, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20210909101010')
  })

  it('should create a valid unique id', () => {
    mockdate.set(new Date(1989, 1, 2, 12, 0, 59))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_19890102120059')
  })
})
