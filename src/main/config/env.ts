export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean_node_api',
  PORT: process.env.PORT ?? 3333,
  JWT_SECRET: process.env.JWT_SECRET ?? 'dsadDASD456=323D[~~D'
}
