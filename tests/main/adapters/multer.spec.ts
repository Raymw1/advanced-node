import { adaptMulter } from '@/main/adapters'
import { getMockReq, getMockRes } from '@jest-mock/express'
import multer from 'multer'

jest.mock('multer')

describe('MulterAdapter', () => {
  it('should call single upload with correct input', () => {
    const fakeMulter = multer as jest.Mocked<typeof multer>
    const uploadSpy = jest.fn()
    const singleSpy = jest.fn().mockReturnValue(uploadSpy)
    const multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    jest.mocked(fakeMulter).mockImplementation(multerSpy)
    const httpRequest = getMockReq()
    const httpResponse = getMockRes().res
    const next = getMockRes().next
    const sut = adaptMulter

    sut(httpRequest, httpResponse, next)

    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(multerSpy).toHaveBeenCalledWith()
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('picture')
    expect(uploadSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toHaveBeenCalledWith(httpRequest, httpResponse, expect.any(Function))
  })
})
