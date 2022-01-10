import { forbidden, badRequest, notFound, serverError, unauthorized, noContent } from './components'
import { loginPath, signUpPath, surveyPath } from './paths'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'
import { signupParamsSchema } from './schemas/signup-params-schema'

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
  tags: [
    {
      tag: 'Autenticação'
    },
    {
      tag: 'Enquete'
    }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signupParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema
  },
  components: {
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
}
