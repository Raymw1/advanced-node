import { HttpResponse, forbidden, ok } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'
import { RequiredStringValidator } from '@/application/validation'
import { Authorize } from '@/domain/use-cases'

type HttpRequest = { authorization: string }
type Model = { userId: string } | Error

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) return forbidden()
    try {
      const { userId } = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch (error) {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const validationError = new RequiredStringValidator(authorization, 'authorization').validate()
    return validationError === undefined
  }
}
