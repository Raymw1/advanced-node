import { InvalidMimeTypeError } from '@/application/errors'
import { Validator } from '@/application/validation'

type MimeType = 'png' | 'jpg'

export class AllowedMimeTypes implements Validator {
  constructor (
    private readonly allowedMimeTypes: MimeType[],
    private readonly value: string
  ) {
  }

  validate (): Error | undefined {
    return new InvalidMimeTypeError(this.allowedMimeTypes)
  }
}
