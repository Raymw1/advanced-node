import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture
type Input = { userId: string, file: Buffer }
export type ChangeProfilePicture = (params: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ userId, file }) => {
  const fileKey = crypto.uuid({ key: userId })
  await fileStorage.upload({ file, key: fileKey })
}
