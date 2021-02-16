import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL as string)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  const accountCollection = MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  it('Should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_pass'
    })

    expect(account).toBeDefined()
    expect(account.id).toBeDefined()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_pass')
  })
})
