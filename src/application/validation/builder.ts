import { AllowedMimeTypes, MaxFileSize, MimeType, Required, RequiredBuffer, RequiredString, Validator } from '@/application/validation'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: { value: any, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else if (typeof this.value === 'object' && this.value.buffer !== undefined && this.value.buffer instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
    } else {
      this.validators.push(new Required(this.value, this.fieldName))
    }
    return this
  }

  image ({ allowedMimeTypes, maxSizeInMb }: { allowedMimeTypes: MimeType[], maxSizeInMb: number }): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowedMimeTypes, this.value.mimeType))
    }
    if (this.value.buffer !== undefined && this.value.buffer instanceof Buffer) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
