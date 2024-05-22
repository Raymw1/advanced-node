import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (params: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ userId, file }) => {
  let fileUrl: string | undefined
  let initials: string | undefined
  if (file !== undefined) {
    const fileKey = crypto.uuid({ key: userId })
    fileUrl = (await fileStorage.upload({ file, key: fileKey })).fileUrl
  } else {
    const { name } = await userProfileRepository.load({ id: userId })
    if (name !== undefined) {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        initials = name.substring(0, 2).toUpperCase()
      }
    }
  }
  await userProfileRepository.savePicture({ pictureUrl: fileUrl, initials })
}
