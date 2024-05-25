import { Controller, DeleteProfilePictureController } from '@/application/controllers'

describe('DeleteProfilePictureController', () => {
  it('should extend Controller', () => {
    const sut = new DeleteProfilePictureController()

    expect(sut).toBeInstanceOf(Controller)
  })
})
