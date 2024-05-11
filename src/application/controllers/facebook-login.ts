import { RequiredFieldError } from '@/application/errors'
import { HttpResponse, badRequest, ok, serverError, unauthorized } from '@/application/helpers'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

type HttpRequest = {
  token: string
}

type Model = {
  accessToken: string
} | Error

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const validationError = this.validate(httpRequest)
      if (validationError !== undefined) {
        return badRequest(validationError)
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

  private validate (httpRequest: HttpRequest): Error | undefined {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return new RequiredFieldError('token')
    }
  }
}
