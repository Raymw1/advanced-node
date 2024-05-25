import { Controller, DeleteProfilePictureController } from '@/application/controllers'

describe('DeleteProfilePictureController', () => {
  let sut: DeleteProfilePictureController

  beforeEach(() => {
    sut = new DeleteProfilePictureController()
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
