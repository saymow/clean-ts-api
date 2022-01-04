import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import request from 'supertest'

describe('Survey Routes', () => {
  beforeAll(async () => {
    // environment variable set up by @shelf/jest-mongodb in-memory database
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 401 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/anyId/results')
        .send({
          answer: 'any_answer'
        })
        .expect(401)
    })
  })
})
