import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import supertest from 'supertest'
import { sign } from 'jsonwebtoken'
import ENV from '@/main/config/env'

let accountCollection: Collection
let surveyCollection: Collection

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

describe('Survey GraphQL', () => {
  beforeAll(async () => {
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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          answer
          image
        }
        didAnswer
        date
      }
    }`

    test('Should return surveys', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'https://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: now
      })

      const res = await supertest(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          answer: 'Answer 1',
          image: 'https://image-name.com'
        },
        {
          answer: 'Answer 2',
          image: null
        }
      ])
      expect(res.body.data.surveys[0].question).toBe('question')
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].date).toBe(now.toISOString())
    })
  })
})
