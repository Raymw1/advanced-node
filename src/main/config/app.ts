import { setupMiddlewares } from '@/main/config/middlewares'
import { setupRoutes } from '@/main/config/routes'

import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()
setupMiddlewares(app)
setupRoutes(app)
export { app }
