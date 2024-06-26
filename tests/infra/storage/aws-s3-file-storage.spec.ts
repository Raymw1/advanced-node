import { AwsS3FileStorage } from '@/infra/storage'

import { config, S3 } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKeyId: string
  let secretAccessKey: string
  let bucket: string
  let fileName: string
  let sut: AwsS3FileStorage

  beforeAll(() => {
    accessKeyId = 'any_access_key_id'
    secretAccessKey = 'any_secret_access_key'
    bucket = 'any_bucket'
    fileName = 'any_file_name'
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKeyId, secretAccessKey, bucket)
  })

  it('should config aws credentials on creation', () => {
    expect(config.update).toHaveBeenCalledTimes(1)
    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId, secretAccessKey } })
  })

  describe('upload', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
    })

    it('should call putObject with correct input', async () => {
      await sut.upload({ fileName, file })

      expect(putObjectSpy).toHaveBeenCalledTimes(1)
      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: 'public-read'
      })
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('should throw if putObject throws', async () => {
      putObjectPromiseSpy.mockRejectedValueOnce(new Error('put_object_error'))

      const promise = sut.upload({ fileName, file })

      await expect(promise).rejects.toThrow(new Error('put_object_error'))
    })

    it('should return fileUrl', async () => {
      const { fileUrl } = await sut.upload({ fileName, file })

      expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/${fileName}`)
    })

    it('should return encoded fileUrl', async () => {
      const { fileUrl } = await sut.upload({ fileName: 'any file name', file })

      expect(fileUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20file%20name`)
    })
  })

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      jest.mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('should call deleteObject with correct input', async () => {
      await sut.delete({ fileName })

      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName
      })
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('should throw if deleteObject throws', async () => {
      deleteObjectPromiseSpy.mockRejectedValueOnce(new Error('delete_object_error'))

      const promise = sut.delete({ fileName })

      await expect(promise).rejects.toThrow(new Error('delete_object_error'))
    })
  })
})
