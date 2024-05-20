import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeAuthorize } from '@/main/factories/use-cases'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  return new AuthenticationMiddleware(makeAuthorize())
}
