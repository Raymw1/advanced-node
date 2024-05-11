import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest, ok, serverError, unauthorized } from '@/application/helpers'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (result instanceof AuthenticationError) {
        return unauthorized()
      }
      return ok({ accessToken: result.value })
    } catch (error) {
      return serverError(error instanceof Error ? error : undefined)
    }
  }
}
