import { Controller } from '@/application/controllers'
import { ExpressRouter } from '@/infra/http'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'

describe('ExpressRouter', () => {
  it('should call handle with correct request', async () => {
    const httpRequest = getMockReq({ body: { any: 'any' } })
    const { res: httpResponse } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)

    await sut.adapt(httpRequest, httpResponse)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
})
