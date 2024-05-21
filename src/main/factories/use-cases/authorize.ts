import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/gateways'

export const makeAuthorize = (): Authorize => {
  return setupAuthorize(makeJwtTokenHandler())
}
