import { FacebookLoginController } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    const facebookAuthentication = mock<FacebookAuthentication>()
    const sut = new FacebookLoginController(facebookAuthentication)

    await sut.handle({ token: 'any_token' })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })
})
