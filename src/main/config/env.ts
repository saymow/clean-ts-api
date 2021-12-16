export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://mongo:27017/clean-node-api',
  PORT: process.env.PORT ?? 3333,
  JWT_SECRET: process.env.JWT_SECRET ?? 'dsadDASD456=323D[~~D'
}
