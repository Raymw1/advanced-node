import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepository } from '@/main/factories/postgres/repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenHandler())
}
