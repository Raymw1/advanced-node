import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'

type Setup = (
  facebook: Readonly<LoadFacebookUser>,
  userAccountRepository: Readonly<LoadUserAccountRepository & SaveFacebookAccountRepository>,
  crypto: Readonly<TokenGenerator>
) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepository, crypto) => async (params) => {
  const fbData = await facebook.loadUser(params)
  if (fbData === undefined) throw new AuthenticationError()
  const accountData = await userAccountRepository.load({ email: fbData.email })
  const fbAccount = new FacebookAccount(fbData, accountData)
  const { id } = await userAccountRepository.saveWithFacebook(fbAccount)
  const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
