import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId: id } = await accountCollection.insertOne(accountData)
    const { _id, ...insertedAccountData } = await accountCollection.findOne(id)
    const account = Object.assign({}, insertedAccountData, { id: id.toHexString() }) as AccountModel

    return account
  }
}
