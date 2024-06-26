import { Controller, FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredString } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookLoginController', () => {
  let token: string
  let facebookAuthentication: jest.Mock
  let sut: FacebookLoginController

  beforeAll(() => {
    token = 'any_token'
    facebookAuthentication = jest.fn()
    facebookAuthentication.mockResolvedValue({ accessToken: 'any_value' })
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredString(token, 'token')
    ])
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuthentication).toHaveBeenCalledWith({ token })
    expect(facebookAuthentication).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if FacebookAuthentication throws AuthenticationError', async () => {
    facebookAuthentication.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if FacebookAuthentication returns an AccessToken', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
