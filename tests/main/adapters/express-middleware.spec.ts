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
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })
  })

  beforeEach(() => {
    httpRequest.locals = undefined
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

  it('should respond with correct error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })

    await sut(httpRequest, httpResponse, next)

    expect(httpResponse.status).toHaveBeenCalledTimes(1)
    expect(httpResponse.status).toHaveBeenCalledWith(500)
    expect(httpResponse.send).toHaveBeenCalledTimes(1)
    expect(httpResponse.send).toHaveBeenCalledWith({ error: 'any_error' })
  })

  it('should add valid data to httpRequest.locals', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })

    await sut(httpRequest, httpResponse, next)

    expect(httpRequest.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
