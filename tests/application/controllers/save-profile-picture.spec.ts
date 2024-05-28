import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, RequiredBuffer } from '@/application/validation'
import { UserProfileNotFoundError } from '@/domain/errors'

describe('SaveProfilePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let userId: string
  let changeProfilePicture: jest.Mock
  let sut: SaveProfilePictureController

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    userId = 'any_user_id'
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  })

  beforeEach(() => {
    sut = new SaveProfilePictureController(changeProfilePicture)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly on save', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  it('should build Validators correctly on delete', async () => {
    const validators = sut.buildValidators({ file: undefined, userId })

    expect(validators).toEqual([])
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId, file })

    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
    expect(changeProfilePicture).toHaveBeenCalledWith({ userId, file })
  })

  it('should return 404 if ChangeProfilePicture throws UserProfileNotFoundError', async () => {
    const error = new UserProfileNotFoundError()
    changeProfilePicture.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ userId, file })

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: error
    })
  })

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ userId, file })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    })
  })
})
