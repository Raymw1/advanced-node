import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/crypto/jwt-token-handler'

export const makeAuthorize = (): Authorize => {
  return setupAuthorize(makeJwtTokenHandler())
}
