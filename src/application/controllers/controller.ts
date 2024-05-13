import { HttpResponse, badRequest, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const validationError = this.validate(httpRequest)
    if (validationError !== undefined) {
      return badRequest(validationError)
    }
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error instanceof Error ? error : undefined)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
