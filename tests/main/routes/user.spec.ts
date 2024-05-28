import { PgUser } from '@/infra/postgres/entities'
import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { getConnection } from 'typeorm'

describe('User Routes', () => {
  describe('DELETE /users/picture', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(async () => {
      backup.restore()
    })

    it('should return 403 if no authorization header is provided', async () => {
      const { status } = await request(app).delete('/api/users/picture')

      expect(status).toBe(403)
    })
  })
})
