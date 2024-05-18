import { TokenValidator } from '@/domain/contracts/crypto'
import { Authorize, setupAuthorize } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock<TokenValidator>()
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
  })
})
