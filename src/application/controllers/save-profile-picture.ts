import { Controller } from '@/application/controllers'
import { HttpResponse, notFound, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { UserProfileNotFoundError } from '@/domain/errors'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = { pictureUrl: string | undefined, initials: string | undefined } | Error

export class SaveProfilePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId, file }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const { initials, pictureUrl } = await this.changeProfilePicture({ userId, file })
      return ok({ initials, pictureUrl })
    } catch (error) {
      if (error instanceof UserProfileNotFoundError) return notFound(error)
      throw error
    }
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowedMimeTypes: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
