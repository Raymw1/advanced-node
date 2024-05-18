import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'

type Setup = (
  facebookApi: Readonly<LoadFacebookUserApi>,
  userAccountRepository: Readonly<LoadUserAccountRepository & SaveFacebookAccountRepository>,
  crypto: Readonly<TokenGenerator>
) => FacebookAuthentication
export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async (params) => {
  const fbData = await facebookApi.loadUser(params)
  if (fbData === undefined) throw new AuthenticationError()
  const accountData = await userAccountRepository.load({ email: fbData.email })
  const fbAccount = new FacebookAccount(fbData, accountData)
  const { id } = await userAccountRepository.saveWithFacebook(fbAccount)
  const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
