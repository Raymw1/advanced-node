import { JwtTokenHandler } from '@/infra/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string
  let sut: JwtTokenHandler

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })

      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should throw if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('sign_error') })

      const promise = sut.generateToken({ key, expirationInMs })

      await expect(promise).rejects.toThrow(new Error('sign_error'))
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })

      expect(generatedToken).toBe(token)
    })
  })

  describe('validateToken', () => {
    let token: string
    let key: string

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('should call verify with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret)
    })

    it('should throw if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('verify_error') })

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow(new Error('verify_error'))
    })

    it('should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token })

      expect(generatedKey).toBe(key)
    })
  })
})
