import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ userId })
    throw new Error('Method not implemented.')
  }
}
