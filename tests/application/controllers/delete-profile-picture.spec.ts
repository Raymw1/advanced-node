import { Controller, DeleteProfilePictureController } from '@/application/controllers'

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
})
