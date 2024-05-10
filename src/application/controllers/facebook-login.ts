import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest, serverError, unauthorized } from '@/application/helpers'
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
      return {
        statusCode: 200,
        data: {
          accessToken: result.value
        }
      }
    } catch (error) {
      return serverError(error instanceof Error ? error : undefined)
    }
  }
}
