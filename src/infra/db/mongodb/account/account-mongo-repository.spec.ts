import { mockAddAccountParams } from '@/domain/test'
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
    test('Should not throw on add success', async () => {
      const sut = makeSut()

      await expect(sut.add(mockAddAccountParams())).resolves.toBeUndefined()
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
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

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken when updateAccessToken success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
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
      await accountCollection.insertOne(Object.assign({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      }))
      const account = await sut.loadByToken('any_token')

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toEqual('any_name')
      expect(account.email).toEqual('any_email@mail.com')
      expect(account.password).toEqual('any_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeNull()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')

      expect(account).toBeNull()
    })
  })
})
