import app from '@/main/config/app'
import request from 'supertest'
import { noCache } from './no-cache'

describe('CORS Middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('Surrogate-control', 'no-store')
  })
})
