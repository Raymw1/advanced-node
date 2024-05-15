import { Controller } from '@/application/controllers'
import { ExpressRouter } from '@/infra/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Request, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ExpressRouter', () => {
  let httpRequest: Request
  let httpResponse: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    httpRequest = getMockReq({ body: { any: 'any' } })
    httpResponse = getMockRes().res
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    await sut.adapt(httpRequest, httpResponse)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const httpRequest = getMockReq()

    await sut.adapt(httpRequest, httpResponse)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut.adapt(httpRequest, httpResponse)

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

    await sut.adapt(httpRequest, httpResponse)

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

    await sut.adapt(httpRequest, httpResponse)

    expect(httpResponse.status).toHaveBeenCalledWith(500)
    expect(httpResponse.status).toHaveBeenCalledTimes(1)
    expect(httpResponse.json).toHaveBeenCalledWith({ error: 'controller_error' })
    expect(httpResponse.json).toHaveBeenCalledTimes(1)
  })
})
