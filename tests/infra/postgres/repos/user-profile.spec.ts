import { PgUser } from '@/infra/postgres/entities'
import { PgUserProfileRepository } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PgUserProfileRepository', () => {
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  let sut: PgUserProfileRepository

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(async () => {
    backup.restore()
    sut = new PgUserProfileRepository()
  })

  describe('savePicture', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url', initials: undefined })
      const pgUser = await pgUserRepo.findOne({ id })

      expect(pgUser).toMatchObject({
        id,
        email: 'any_email',
        pictureUrl: 'any_url',
        initials: null
      })
    })
  })
})
