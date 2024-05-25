import { Controller, DeleteProfilePictureController } from '@/application/controllers'
import { UserProfileNotFoundError } from '@/domain/errors'

describe('DeleteProfilePictureController', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeleteProfilePictureController

  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    sut = new DeleteProfilePictureController(changeProfilePicture)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' })
  })

  it('should return 404 if ChangeProfilePicture throws UserProfileNotFoundError', async () => {
    const error = new UserProfileNotFoundError()
    changeProfilePicture.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 404,
      data: error
    })
  })

  it('should return 204 on success', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})
