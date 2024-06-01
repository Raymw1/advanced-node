import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { makePgTransactionController } from '@/main/factories/decorators'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'

export const makeSaveProfilePictureController = (): Controller => {
  const controller = new SaveProfilePictureController(makeChangeProfilePicture())
  return makePgTransactionController(controller)
}
