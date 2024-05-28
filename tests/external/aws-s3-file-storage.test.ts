import { AwsS3FileStorage } from '@/infra/storage'
import { env } from '@/main/config/env'
import axios from 'axios'

type UploadedFile = {
  status: number
}

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(env.s3.accessKeyId, env.s3.secretAccessKey, env.s3.bucket)
  })

  it('should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const fileName = 'any_file_name.png'

    const { fileUrl } = await sut.upload({ fileName, file })

    const uploadedFile = await axios.get<UploadedFile>(fileUrl)
    expect(uploadedFile.status).toBe(200)

    await sut.delete({ fileName })

    await expect(axios.get(fileUrl)).rejects.toThrow()
  })
})
