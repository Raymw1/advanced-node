import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUUIDHandler } from '@/main/factories/gateways'
import { makePgUserProfileRepository } from '@/main/factories/postgres/repos'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(makeAwsS3FileStorage(), makeUUIDHandler(), makePgUserProfileRepository())
}
