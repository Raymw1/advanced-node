import { Controller } from '@/application/controllers'
import { HttpResponse, badRequest } from '@/application/helpers'
import { InvalidMimeTypeError, RequiredFieldError } from '@/application/errors'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }

export class SaveProfilePictureController extends Controller {
  async perform ({ file }: HttpRequest): Promise<HttpResponse> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
  }
}
