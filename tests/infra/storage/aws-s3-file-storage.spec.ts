import { AwsS3FileStorage } from '@/infra/storage'

import { config } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  it('should config aws credentials on creation', () => {
    const accessKeyId = 'any_access_key_id'
    const secretAccessKey = 'any_secret_access_key'
    const sut = new AwsS3FileStorage(accessKeyId, secretAccessKey)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledTimes(1)
    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId, secretAccessKey } })
  })
})
