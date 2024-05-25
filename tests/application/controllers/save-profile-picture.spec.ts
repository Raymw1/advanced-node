import { SaveProfilePictureController } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'

describe('SaveProfilePictureController', () => {
  it('should return 400 if file is not provided', async () => {
    const sut = new SaveProfilePictureController()

    const httpResponse = await sut.handle({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is not provided', async () => {
    const sut = new SaveProfilePictureController()

    const httpResponse = await sut.handle({ file: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})
