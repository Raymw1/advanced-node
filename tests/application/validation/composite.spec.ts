import { ValidationComposite, Validator } from '@/application/validation'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]
  let sut: ValidationComposite

  beforeEach(() => {
    validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
    sut = new ValidationComposite(validators)
  })

  it('should return the first error if several Validators return error', () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'))
    validator2.validate.mockReturnValueOnce(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_1'))
  })

  it('should return error if one Validator returns error', () => {
    validator2.validate.mockReturnValueOnce(new Error('error_2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('error_2'))
  })

  it('should return undefined if all Validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
