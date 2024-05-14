import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let axiosHttpClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosHttpClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosHttpClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })

  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: 'any_token' })

    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      email: 'any_fb_email',
      name: 'any_fb_name'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
