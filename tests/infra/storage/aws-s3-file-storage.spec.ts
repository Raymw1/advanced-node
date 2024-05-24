import { AwsS3FileStorage } from '@/infra/storage'

import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKeyId: string
  let secretAccessKey: string
  let bucket: string
  let key: string
  let file: Buffer
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock
  let sut: AwsS3FileStorage

  beforeAll(() => {
    accessKeyId = 'any_access_key_id'
    secretAccessKey = 'any_secret_access_key'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKeyId, secretAccessKey, bucket)
  })

  it('should config aws credentials on creation', () => {
    expect(config.update).toHaveBeenCalledTimes(1)
    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId, secretAccessKey } })
  })

  it('should call putObject with correct input', async () => {
    await sut.upload({ key: 'any_key', file })

    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw if putObject throws', async () => {
    putObjectPromiseSpy.mockRejectedValueOnce(new Error('put_object_error'))

    const promise = sut.upload({ key: 'any_key', file })

    await expect(promise).rejects.toThrow(new Error('put_object_error'))
  })
})
