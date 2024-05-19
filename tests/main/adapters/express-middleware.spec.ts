import { Middleware } from '@/application/middlewares'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'
import { adaptExpressMiddleware } from '@/main/adapters'

describe('ExpressMiddleware', () => {
  it('should call handle with correct request', async () => {
    const httpRequest = getMockReq({ headers: { any: 'any' } })
    const httpResponse = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    await sut(httpRequest, httpResponse, next)

    expect(middleware.handle).toHaveBeenCalledTimes(1)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const httpRequest = getMockReq({})
    const httpResponse = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    await sut(httpRequest, httpResponse, next)

    expect(middleware.handle).toHaveBeenCalledTimes(1)
    expect(middleware.handle).toHaveBeenCalledWith({})
  })
})
