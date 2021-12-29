import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import ENV from '../config/env'
import { sign } from 'jsonwebtoken'

describe('Survey Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    // environment variable set up by @shelf/jest-mongodb in-memory database
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 401 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [
            {
              answer: 'Answer 1',
              images: 'https://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(401)
    })

    test('Should return 204 on add survey', async () => {
      const { insertedId: id } = await accountCollection.insertOne({
        name: 'Gustavo',
        email: 'gustavo_alves2010@yahoo.com.br',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign({ id }, ENV.JWT_SECRET)

      await accountCollection.updateOne({ _id: id }, {
        $set: { accessToken }
      })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [
            {
              answer: 'Answer 1',
              images: 'https://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 401 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(401)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const { insertedId: id } = await accountCollection.insertOne({
        name: 'Gustavo',
        email: 'gustavo_alves2010@yahoo.com.br',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign({ id }, ENV.JWT_SECRET)

      await accountCollection.updateOne({ _id: id }, {
        $set: { accessToken }
      })

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
