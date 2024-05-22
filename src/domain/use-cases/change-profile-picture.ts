import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { SaveUserPictureRepository } from '@/domain/contracts/repos'

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepository: SaveUserPictureRepository
) => ChangeProfilePicture
type Input = { userId: string, file?: Buffer }
export type ChangeProfilePicture = (params: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepository) => async ({ userId, file }) => {
  if (file !== undefined) {
    const fileKey = crypto.uuid({ key: userId })
    const { fileUrl } = await fileStorage.upload({ file, key: fileKey })
    await userProfileRepository.savePicture({ pictureUrl: fileUrl })
  }
}
