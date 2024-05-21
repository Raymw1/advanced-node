import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/gateways'
import { makeJwtTokenHandler } from '@/main/factories/crypto/jwt-token-handler'
import { makePgUserAccountRepository } from '@/main/factories/repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenHandler())
}
