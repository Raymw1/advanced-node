import { Controller } from '@/application/controllers'
import { HttpResponse, badRequest, notFound, ok } from '@/application/helpers'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { UserProfileNotFoundError } from '@/domain/errors'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = { pictureUrl: string | undefined, initials: string | undefined } | Error

export class SaveProfilePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId, file }: HttpRequest): Promise<HttpResponse<Model>> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    if (file.buffer.byteLength > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    try {
      const { initials, pictureUrl } = await this.changeProfilePicture({ userId, file: file.buffer })
      return ok({ initials, pictureUrl })
    } catch (error) {
      if (error instanceof UserProfileNotFoundError) return notFound(error)
      throw error
    }
  }
}
