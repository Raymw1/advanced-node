import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PgUserAccountRepository', () => {
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  let sut: PgUserAccountRepository

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
    sut = new PgUserAccountRepository()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const accountData = await sut.load({ email: 'existing_email' })

      expect(accountData).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exist', async () => {
      const accountData = await sut.load({ email: 'any_email' })

      expect(accountData).toBe(undefined)
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an user account if no id is provided', async () => {
      await sut.saveWithFacebook({ name: 'any_name', email: 'any_email', facebookId: 'any_fb_id' })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })
      expect(pgUser?.id).toBe(1)
    })
  })
})
