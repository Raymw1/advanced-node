import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'

type Setup = (
  facebookApi: Readonly<LoadFacebookUserApi>,
  userAccountRepository: Readonly<LoadUserAccountRepository & SaveFacebookAccountRepository>,
  crypto: Readonly<TokenGenerator>
) => FacebookAuthentication
export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async (params) => {
  const fbData = await facebookApi.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await userAccountRepository.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepository.saveWithFacebook(fbAccount)
    const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return new AccessToken(token)
  }
  return new AuthenticationError()
}
