import { PgUser } from '@/infra/postgres/entities'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { sign } from 'jsonwebtoken'
import { IBackup } from 'pg-mem'
import request from 'supertest'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('User Routes', () => {
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>

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
  })

  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is provided', async () => {
      const { status } = await request(app).delete('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 on success', async () => {
      const { id } = await pgUserRepo.save({ name: 'Any name', email: 'any_email', pictureUrl: 'any_url' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'AN' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()
    jest.mock('@/infra/storage/aws-s3-file-storage', () => ({ AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy }) }))

    it('should return 403 if no authorization header is provided', async () => {
      const { status } = await request(app).put('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 on success', async () => {
      uploadSpy.mockResolvedValueOnce({ fileUrl: 'any_url' })
      const { id } = await pgUserRepo.save({ name: 'Any name', email: 'any_email' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
