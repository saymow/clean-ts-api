import { AccountModel, LoadAccountByToken, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async execute (token: string, role?: string): Promise<AccountModel> {
    if (!(await this.decrypter.decrypt(token))) {
      return null
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(token, role)

    if (!account) {
      return null
    }

    return account
  }
}