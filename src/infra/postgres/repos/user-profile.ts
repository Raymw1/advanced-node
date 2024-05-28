import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserProfileRepository implements SaveUserPictureRepository, LoadUserProfileRepository {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPictureRepository.Input): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: LoadUserProfileRepository.Input): Promise<LoadUserProfileRepository.Output> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) })
    if (pgUser !== undefined) return { name: pgUser.name ?? undefined }
  }
}
