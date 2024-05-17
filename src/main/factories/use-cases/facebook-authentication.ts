import { FacebookAuthenticationUseCase } from '@/data/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makeJwtTokenGenerator } from '@/main/factories/crypto/jwt-token-generator'
import { makePgUserAccountRepository } from '@/main/factories/repos'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(makeFacebookApi(), makePgUserAccountRepository(), makeJwtTokenGenerator())
}
