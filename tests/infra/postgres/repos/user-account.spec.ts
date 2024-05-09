import { PgUser, PgUserAccountRepository } from '@/infra/postgres/repos'

import { newDb } from 'pg-mem'
import { getRepository } from 'typeorm'

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({ email: 'existing_email' })
      const sut = new PgUserAccountRepository()

      const accountData = await sut.load({ email: 'existing_email' })

      expect(accountData).toEqual({ id: '1' })
      await connection.close()
    })

    it('should return undefined if email does not exist', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
      const sut = new PgUserAccountRepository()

      const accountData = await sut.load({ email: 'any_email' })

      expect(accountData).toBe(undefined)
      await connection.close()
    })
  })
})
