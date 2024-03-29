import app from '@/main/config/app'
import ENV from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
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

  return accessToken
}

describe('Survey Routes', () => {
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
      const accessToken = await makeAccessToken()

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
      const accessToken = await makeAccessToken()

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
