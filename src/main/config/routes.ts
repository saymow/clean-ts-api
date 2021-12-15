import { readdirSync } from 'fs'
import path from 'path'
import { Express, Router } from 'express'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  readdirSync(path.resolve(__dirname, '..', 'routes')).forEach(async (fileName) => {
    if (!fileName.includes('.test.')) {
      (await import(path.resolve(__dirname, '..', 'routes', fileName))).default(router)
    }
  })
}
