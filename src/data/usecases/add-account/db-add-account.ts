import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async execute (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPass = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPass }))

    return account
  }
}
