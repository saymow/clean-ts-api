import { accessDenied, badRequest, notFound, serverError, unauthorized } from './components'
import { loginPath } from './paths'
import { accountSchema, errorSchema, loginsParamsSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso do mango.',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    tag: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginsParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    accessDenied,
    unauthorized,
    serverError,
    notFound
  }
}
