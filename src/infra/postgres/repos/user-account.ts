import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser?.id.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, email, name, facebookId }: SaveFacebookAccountRepository.Input): Promise<SaveFacebookAccountRepository.Output> {
    const pgUserRepo = getRepository(PgUser)
    let persistedId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ name, email, facebookId })
      persistedId = pgUser.id.toString()
    } else {
      persistedId = id
      await pgUserRepo.save({ id: parseInt(id), name, facebookId })
    }
    return { id: persistedId }
  }
}
