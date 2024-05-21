import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let facebook: MockProxy<LoadFacebookUser>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebook = mock<LoadFacebookUser>()
    facebook.loadUser.mockResolvedValue({
      facebookId: 'any_fb_id',
      email: 'any_fb_email',
      name: 'any_fb_name'
    })
    userAccountRepository = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock<TokenGenerator>()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebook, userAccountRepository, crypto)
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut({ token })

    expect(facebook.loadUser).toHaveBeenCalledWith({ token })
    expect(facebook.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if LoadFacebookUser throws', async () => {
    facebook.loadUser.mockRejectedValueOnce(new Error(('fb_error')))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebook.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUser returns data', async () => {
    await sut({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error(('load_error')))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error(('save_error')))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error(('token_error')))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })

  it('should return an AccessToken on success', async () => {
    const accessToken = await sut({ token })

    expect(accessToken).toEqual({ accessToken: 'any_generated_token' })
  })
})
