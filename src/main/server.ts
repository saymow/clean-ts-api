import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

void (async () => {
  await MongoHelper.connect(env.MONGO_URL)
  const app = (await import('./config/app')).default

  app.listen(env.PORT, () => console.log(`Server is up and running at: http://localhost:${env.PORT}`))
})().catch(console.error)
