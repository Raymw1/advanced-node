import { Middleware } from '@/application/middlewares'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { MockProxy, mock } from 'jest-mock-extended'
import { adaptExpressMiddleware } from '@/main/adapters'
import { NextFunction, Request, RequestHandler, Response } from 'express'

describe('ExpressMiddleware', () => {
  let httpRequest: Request
  let httpResponse: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    httpRequest = getMockReq({ headers: { any: 'any' } })
    httpResponse = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(httpRequest, httpResponse, next)

    expect(middleware.handle).toHaveBeenCalledTimes(1)
    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const httpRequest = getMockReq({})

    await sut(httpRequest, httpResponse, next)

    expect(middleware.handle).toHaveBeenCalledTimes(1)
    expect(middleware.handle).toHaveBeenCalledWith({})
  })
})
