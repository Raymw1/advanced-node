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
    if (this.isPng() || this.isJpg()) return undefined
    return new InvalidMimeTypeError(this.allowedMimeTypes)
  }

  private isPng (): boolean {
    return this.allowedMimeTypes.includes('png') && this.value === 'image/png'
  }

  private isJpg (): boolean {
    return this.allowedMimeTypes.includes('jpg') && /image\/jpe?g/.test(this.value)
  }
}
