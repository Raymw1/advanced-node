import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

export class ServerError extends Error {
  constructor (error?: Error) {
    super('Internal server error. Try again soon.')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (result instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: result
        }
      }
      return {
        statusCode: 200,
        data: {
          accessToken: result.value
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error instanceof Error ? error : undefined)
      }
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}
