import { Validator } from '@/application/validation'
import { MaxFileSizeError } from '@/application/errors'

export class MaxFileSize implements Validator {
  constructor (
    private readonly maxSizeInMb: number,
    private readonly value: Buffer
  ) {
  }

  validate (): Error | undefined {
    return new MaxFileSizeError(this.maxSizeInMb)
  }
}
