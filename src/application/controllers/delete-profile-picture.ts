import { Controller } from '@/application/controllers'
import { HttpResponse, noContent, notFound } from '@/application/helpers'
import { UserProfileNotFoundError } from '@/domain/errors'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    try {
      await this.changeProfilePicture({ userId })
      return noContent()
    } catch (error) {
      if (error instanceof UserProfileNotFoundError) return notFound(error)
      throw error
    }
  }
}
