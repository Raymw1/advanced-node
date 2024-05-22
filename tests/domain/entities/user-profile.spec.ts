import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: undefined })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'rayan melino wilbert' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'RW'
    })
  })

  it('should create initials with first two letters of first name', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'rayan' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'RA'
    })
  })

  it('should create initials with a single one letter of name', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'r' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'R'
    })
  })

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ pictureUrl: undefined, name: undefined })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
