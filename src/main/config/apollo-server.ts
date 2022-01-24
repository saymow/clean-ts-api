import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import typeDefs from '@/main/graphql/typedefs'
import resolvers from '@/main/graphql/resolvers'

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })

  await server.start()

  server.applyMiddleware({ app })
}
