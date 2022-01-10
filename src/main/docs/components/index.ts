import { apiKeyAuthSchema } from '../schemas/api-key-auth-schema'
import { forbidden } from './access-denied'
import { badRequest } from './bad-request'
import { noContent } from './no-content'
import { notFound } from './not-found'
import { serverError } from './server-error'
import { unauthorized } from './unauthorized'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  forbidden,
  unauthorized,
  serverError,
  notFound,
  noContent
}
