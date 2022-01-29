import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import supertest from 'supertest'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "gustavo_alves2010@yahoo.com.br", password: "123") {
        accessToken
        name
      }
    }`

    test('Should return an account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gustavo',
        email: 'gustavo_alves2010@yahoo.com.br',
        password
      })
      const res = await supertest(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Gustavo')
    })

    test('Should return unauthorized error on invalid credentials', async () => {
      const res = await supertest(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
    })
  })
})
