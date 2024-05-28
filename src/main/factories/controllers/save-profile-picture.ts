import { SaveProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'

export const makeSaveProfilePictureController = (): SaveProfilePictureController => {
  return new SaveProfilePictureController(makeChangeProfilePicture())
}
