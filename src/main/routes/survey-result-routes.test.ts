import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import ENV from '@/main/config/env'
import app from '@/main/config/app'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

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

const makeSurveyId = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'question',
    answers: [
      {
        answer: 'Answer 1',
        images: 'https://image-name.com'
      },
      {
        answer: 'Answer 2'
      }
    ],
    date: new Date()
  })

  return insertedId.toHexString()
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 401 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/anyId/results')
        .send({
          answer: 'any_answer'
        })
        .expect(401)
    })

    test('Should return 200 on save survey result with token', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await makeSurveyId()

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 401 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/anyId/results')
        .expect(401)
    })
  })
})
