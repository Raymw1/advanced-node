import { DeleteFile, UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
type Output = { pictureUrl: string | undefined, initials: string | undefined }
export type ChangeProfilePicture = (params: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ userId, file }) => {
  const data: { pictureUrl: string | undefined, name: string | undefined } = { pictureUrl: undefined, name: undefined }
  const fileKey = crypto.uuid({ key: userId })
  if (file !== undefined) {
    data.pictureUrl = (await fileStorage.upload({ file, key: fileKey })).fileUrl
  } else {
    data.name = (await userProfileRepository.load({ id: userId })).name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  try {
    await userProfileRepository.savePicture(userProfile)
  } catch (error) {
    await fileStorage.delete({ key: fileKey })
  }
  return userProfile
}
