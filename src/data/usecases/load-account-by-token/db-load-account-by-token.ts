import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

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
