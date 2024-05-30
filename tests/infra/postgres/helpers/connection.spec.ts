import { PgConnection } from '@/infra/postgres/helpers'

describe('PgConnection', () => {
  it('should have only one instance', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })
})
