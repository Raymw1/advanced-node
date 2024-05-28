import { DeleteFile, UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { UserProfileNotFoundError } from '@/domain/errors'

type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository & LoadUserProfileRepository
) => ChangeProfilePicture
type Input = { userId: string, file?: { buffer: Buffer, mimeType: string } }
type Output = { pictureUrl: string | undefined, initials: string | undefined }
export type ChangeProfilePicture = (params: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ userId, file }) => {
  const userProfileById = await userProfileRepository.load({ id: userId })
  if (userProfileById === undefined) throw new UserProfileNotFoundError()
  const data: { pictureUrl: string | undefined, name: string | undefined } = { pictureUrl: undefined, name: undefined }
  const fileKey = crypto.uuid({ key: userId })
  if (file !== undefined) {
    data.pictureUrl = (await fileStorage.upload({ file: file.buffer, fileName: `${fileKey}.${file.mimeType.split('/')[1]}` })).fileUrl
  } else {
    data.name = userProfileById.name
  }
  const userProfile = new UserProfile(userId)
  userProfile.setPicture(data)
  try {
    await userProfileRepository.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ fileName: fileKey })
    throw error
  }
  return userProfile
}
