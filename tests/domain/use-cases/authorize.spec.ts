import { TokenValidator } from '@/domain/contracts/gateways'
import { Authorize, setupAuthorize } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock<TokenValidator>()
    crypto.validateToken.mockResolvedValue('any_id')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
  })

  it('should return the user id of valid accessToken', async () => {
    const { userId } = await sut({ token })

    expect(userId).toBe('any_id')
  })
})
