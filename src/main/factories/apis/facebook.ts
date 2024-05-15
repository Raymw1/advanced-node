import { FacebookApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeFacebookApi = (): FacebookApi => {
  const { clientId, clientSecret } = env.facebookApi
  return new FacebookApi(makeAxiosHttpClient(), clientId, clientSecret)
}
