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
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    await sut.adapt(httpRequest, httpResponse)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const httpRequest = getMockReq()

    await sut.adapt(httpRequest, httpResponse)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
