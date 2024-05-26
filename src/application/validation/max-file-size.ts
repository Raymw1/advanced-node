import { Validator } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSize implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {
  }

  validate (): Error | undefined {
    const maxSizeInBytes = this.maxSizeInMb * 1024 * 1024
    if (this.value.byteLength > maxSizeInBytes) {
      return new MaxFileSizeError(this.maxSizeInMb)
    }
  }
}
