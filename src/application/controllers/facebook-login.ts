import { Controller } from '@/application/controllers'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { FacebookAuthentication } from '@/domain/use-cases'

type HttpRequest = { token: string }
type Model = { accessToken: string } | Error

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const { accessToken } = await this.facebookAuthentication({ token })
      return ok({ accessToken })
    } catch (error) {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
