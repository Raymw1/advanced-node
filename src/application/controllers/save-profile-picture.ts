import { Controller } from '@/application/controllers'
import { HttpResponse, badRequest } from '@/application/helpers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }

export class SaveProfilePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId, file }: HttpRequest): Promise<HttpResponse> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    if (file.buffer.byteLength > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    await this.changeProfilePicture({ userId, file: file.buffer })
    throw new Error('Method not implemented.')
  }
}
