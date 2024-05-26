import { MaxFileSizeError } from '@/application/errors'
import { MaxFileSize } from '@/application/validation'

describe('MaxFileSize', () => {
  it('should return MaxFileSizeError if value is invalid', () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(2 * 1024 * 1024 + 1))
    const sut = new MaxFileSize(2, invalidBuffer)

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(2))
  })

  it('should return undefined if value is valid', () => {
    const sut = new MaxFileSize(2, Buffer.from('any_buffer'))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new MaxFileSize(2, Buffer.from(new ArrayBuffer(2 * 1024 * 1024)))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
