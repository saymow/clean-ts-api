import { AddAccount, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async execute (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountExists = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (accountExists) return null

    const hashedPass = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPass }))

    return Boolean(account)
  }
}
