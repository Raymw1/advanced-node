import { Controller } from '@/application/controllers'
import { HttpResponse, badRequest } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = { file: any }

export class SaveProfilePictureController extends Controller {
  async perform (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new RequiredFieldError('file'))
  }
}
