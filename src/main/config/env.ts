import dotenv from 'dotenv'

dotenv.config()

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? ''
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? ''
  },
  port: process.env.PORT ?? 3333,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
