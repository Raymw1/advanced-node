import { config } from 'aws-sdk'

export class AwsS3FileStorage {
  constructor (
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string
  ) {
    config.update({ credentials: { accessKeyId, secretAccessKey } })
  }
}
