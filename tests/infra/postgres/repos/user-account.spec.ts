import { PgUser, PgUserAccountRepository } from '@/infra/postgres/repos'

import { IBackup, newDb } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PgUserAccountRepository', () => {
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup
  let sut: PgUserAccountRepository

  beforeAll(async () => {
    const db = newDb()
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    })
    await connection.synchronize()
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
})
