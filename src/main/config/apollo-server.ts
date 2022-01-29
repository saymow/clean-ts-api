import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import typeDefs from '@/main/graphql/typedefs'
import resolvers from '@/main/graphql/resolvers'
import { GraphQLError } from 'graphql'
import { GraphQLResponse } from 'apollo-server-core'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authDirectiveTransformer } from '../graphql/directives'

const handleErrors = (response: GraphQLResponse, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError.name].includes(errorName)
}

const schema = authDirectiveTransformer(makeExecutableSchema({ resolvers, typeDefs }))

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [{
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
      })
    }]
  })

  await server.start()

  server.applyMiddleware({ app })
}
