import setupMiddlewares from './middlewares'
import setupSwagger from './config-swagger'
import setupRoutes from './routes'
import express from 'express'

const app = express()

setupSwagger(app)
setupMiddlewares(app)
void setupRoutes(app)

export default app
