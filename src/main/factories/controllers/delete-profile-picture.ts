import { DeleteProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/use-cases'

export const makeDeleteProfilePictureController = (): DeleteProfilePictureController => {
  return new DeleteProfilePictureController(makeChangeProfilePicture())
}
