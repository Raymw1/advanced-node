import { HttpResponse, forbidden } from '@/application/helpers'
import { Authorize } from '@/domain/use-cases'

type HttpRequest = { authorization: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
    await this.authorize({ token: httpRequest.authorization })
    return forbidden()
  }
}
