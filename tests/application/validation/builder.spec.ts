import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@/application/validation'

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

  it('should return a RequiredBuffer', () => {
    const file = { buffer: Buffer.from('any_buffer') }

    const validators = ValidationBuilder
      .of({ value: file, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(file.buffer, 'any_name')])
  })

  it('should return a Required', () => {
    const value = { any: 'any' }

    const validators = ValidationBuilder
      .of({ value, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new Required(value, 'any_name')])
  })

  it('should return correct image validators', () => {
    const buffer = 'invalid_buffer'

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_name' })
      .image({ allowedMimeTypes: ['png'], maxSizeInMb: 2 })
      .build()

    expect(validators).toEqual([])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_name' })
      .image({ allowedMimeTypes: ['png'], maxSizeInMb: 2 })
      .build()

    expect(validators).toEqual([new MaxFileSize(2, buffer)])
  })

  it('should return correct image validators', () => {
    const mimeType = 'any_mime_type'

    const validators = ValidationBuilder
      .of({ value: { mimeType }, fieldName: 'any_name' })
      .image({ allowedMimeTypes: ['png'], maxSizeInMb: 2 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], mimeType)])
  })

  it('should return correct image validators', () => {
    const file = { buffer: Buffer.from('any_buffer'), mimeType: 'any_mime_type' }

    const validators = ValidationBuilder
      .of({ value: file, fieldName: 'any_name' })
      .image({ allowedMimeTypes: ['png'], maxSizeInMb: 2 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], file.mimeType), new MaxFileSize(2, file.buffer)])
  })

  it('should return correct image validators', () => {
    const file = { }

    const validators = ValidationBuilder
      .of({ value: file, fieldName: 'any_name' })
      .image({ allowedMimeTypes: ['png'], maxSizeInMb: 2 })
      .build()

    expect(validators).toEqual([])
  })
})
