import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/crypto/jwt-token-generator'

export const makeAuthorize = (): Authorize => {
  return setupAuthorize(makeJwtTokenHandler())
}
