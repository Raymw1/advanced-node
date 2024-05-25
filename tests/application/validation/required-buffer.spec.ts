import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredBuffer } from '@/application/validation'

describe('RequiredBuffer', () => {
  it('should extend Required', () => {
    const sut = new RequiredBuffer(Buffer.from(''), 'any_field')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''), 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'), 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
