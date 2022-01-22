import { Decrypter, LoadAccountByToken, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async execute (token: string, role?: string): Promise<LoadAccountByToken.Result> {
    try {
      if (!(await this.decrypter.decrypt(token))) {
        return null
      }
    } catch {
      return null
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(token, role)

    if (!account) {
      return null
    }

    return account
  }
}
