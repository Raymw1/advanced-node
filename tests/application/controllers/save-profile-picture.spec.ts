import { SaveProfilePictureController } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'

describe('SaveProfilePictureController', () => {
  let sut: SaveProfilePictureController

  beforeEach(() => {
    sut = new SaveProfilePictureController()
  })

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})
