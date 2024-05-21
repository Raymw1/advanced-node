import { UploadFile } from '@/domain/contracts/gateways'

type Setup = (fileStorage: UploadFile) => ChangeProfilePicture
type Input = { userId: string, file: Buffer }
export type ChangeProfilePicture = (params: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage) => async ({ userId, file }) => {
  await fileStorage.upload({ file, key: userId })
}
