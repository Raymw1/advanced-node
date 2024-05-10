import { FacebookLoginController } from '@/application/controllers'

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController()

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })
})
