import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    // environment variable set up by @shelf/jest-mongodb in-memory database
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken', () => {
    test('Should update the account accessToken when updateAccessToken success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      let account = await accountCollection.findOne(insertedId)

      expect(account.accessToken).toBeFalsy()

      await sut.updateAccessToken(insertedId.toString(), 'any_token')
      account = await accountCollection.findOne(insertedId)

      expect(account).toBeDefined()
      expect(account.accessToken).toEqual('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')

      expect(account).toBeNull()
    })
  })
})
