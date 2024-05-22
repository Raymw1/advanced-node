import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (params: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ userId, file }) => {
  const data: { pictureUrl: string | undefined, name: string | undefined } = { pictureUrl: undefined, name: undefined }
  if (file !== undefined) {
    const fileKey = crypto.uuid({ key: userId })
    data.pictureUrl = (await fileStorage.upload({ file, key: fileKey })).fileUrl
  } else {
    data.name = (await userProfileRepository.load({ id: userId })).name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  await userProfileRepository.savePicture(userProfile)
}
