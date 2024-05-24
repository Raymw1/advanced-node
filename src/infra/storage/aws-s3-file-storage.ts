import { UploadFile } from '@/domain/contracts/gateways'

import { S3, config } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile {
  constructor (accessKeyId: string, secretAccessKey: string, private readonly bucket: string) {
    config.update({ credentials: { accessKeyId, secretAccessKey } })
  }

  async upload ({ key, file }: UploadFile.Input): Promise<UploadFile.Output> {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return { fileUrl: 'invalid_url' }
  }
}
