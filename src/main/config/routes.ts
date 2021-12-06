import { Express, Router } from 'express'
import fg from 'fast-glob'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  for (const filePath of fg.sync('**/src/main/routes/**routes.ts')) {
    ((await import(`../../../${filePath}`)).default(router))
  }
}
