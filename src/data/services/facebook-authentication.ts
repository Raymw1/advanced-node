import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.userAccountRepository.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
