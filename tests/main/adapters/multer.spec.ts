import { adaptMulter } from '@/main/adapters'

import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import multer from 'multer'

jest.mock('multer')

describe('MulterAdapter', () => {
  let fakeMulter: jest.Mocked<typeof multer>
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: jest.Mock
  let httpRequest: Request
  let httpResponse: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    fakeMulter = multer as jest.Mocked<typeof multer>
    uploadSpy = jest.fn()
    singleSpy = jest.fn().mockReturnValue(uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    httpRequest = getMockReq()
    httpResponse = getMockRes().res
    next = getMockRes().next
  })

  beforeEach(() => {
    sut = adaptMulter
  })

  it('should call single upload with correct input', () => {
    sut(httpRequest, httpResponse, next)

    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(multerSpy).toHaveBeenCalledWith()
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(uploadSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(httpRequest, httpResponse, expect.any(Function))
  })
})
