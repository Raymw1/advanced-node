export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? ''
  },
  port: process.env.PORT ?? 3333,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
