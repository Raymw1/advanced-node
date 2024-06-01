import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'
import { PgConnection } from '@/infra/postgres/helpers'

export class PgUserProfileRepository implements SaveUserPictureRepository, LoadUserProfileRepository {
  constructor (private readonly connection: PgConnection = PgConnection.getInstance()) {}

  async savePicture ({ id, pictureUrl, initials }: SaveUserPictureRepository.Input): Promise<void> {
    const pgUserRepo = this.connection.getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: LoadUserProfileRepository.Input): Promise<LoadUserProfileRepository.Output> {
    const pgUserRepo = this.connection.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) })
    if (pgUser !== undefined) return { name: pgUser.name ?? undefined }
  }
}
