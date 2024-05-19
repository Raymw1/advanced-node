import { Controller } from '@/application/controllers'
import { adaptExpressRoute } from '@/main/adapters'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ExpressRouter', () => {
  let httpRequest: Request
  let httpResponse: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeAll(() => {
    httpRequest = getMockReq({ body: { any: 'any' } })
    httpResponse = getMockRes().res
    next = getMockRes().next
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controller)
  })

  it('should call handle with correct request', async () => {
    await sut(httpRequest, httpResponse, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const httpRequest = getMockReq()

    await sut(httpRequest, httpResponse, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut(httpRequest, httpResponse, next)

    expect(httpResponse.status).toHaveBeenCalledWith(200)
    expect(httpResponse.status).toHaveBeenCalledTimes(1)
    expect(httpResponse.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(httpResponse.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and valid error', async () => {
    controller.handle.mockResolvedValue({
      statusCode: 400,
      data: new Error('controller_error')
    })

    await sut(httpRequest, httpResponse, next)

    expect(httpResponse.status).toHaveBeenCalledWith(400)
    expect(httpResponse.status).toHaveBeenCalledTimes(1)
    expect(httpResponse.json).toHaveBeenCalledWith({ error: 'controller_error' })
    expect(httpResponse.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 500 and valid error', async () => {
    controller.handle.mockResolvedValue({
      statusCode: 500,
      data: new Error('controller_error')
    })

    await sut(httpRequest, httpResponse, next)

    expect(httpResponse.status).toHaveBeenCalledWith(500)
    expect(httpResponse.status).toHaveBeenCalledTimes(1)
    expect(httpResponse.json).toHaveBeenCalledWith({ error: 'controller_error' })
    expect(httpResponse.json).toHaveBeenCalledTimes(1)
  })
})
