import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email })
    if (pgUser !== undefined) {
      return {
        id: pgUser?.id.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ id, email, name, facebookId }: SaveParams): Promise<SaveResult> {
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
