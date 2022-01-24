import setupMiddlewares from './middlewares'
import setupSwagger from './swagger'
import setupApolloServer from './apollo-server'
import setupStaticFiles from './static-files'
import setupRoutes from './routes'
import express from 'express'

const app = express()

void setupApolloServer(app)
setupSwagger(app)
setupStaticFiles(app)
setupMiddlewares(app)
void setupRoutes(app)

export default app
