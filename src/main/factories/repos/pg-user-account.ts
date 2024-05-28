import { PgUserProfileRepository } from '@/infra/postgres/repos'

export const makePgUserProfileRepository = (): PgUserProfileRepository => {
  return new PgUserProfileRepository()
}
