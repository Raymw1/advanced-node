import { Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return a RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  it('should return a RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: buffer, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer, 'any_name')])
  })

  it('should return a Required', () => {
    const value = { any: 'any' }

    const validators = ValidationBuilder
      .of({ value, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new Required(value, 'any_name')])
  })
})
