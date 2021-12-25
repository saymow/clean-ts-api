import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import ENV from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  return new DbLoadAccountByToken(new JwtAdapter(ENV.JWT_SECRET), new AccountMongoRepository())
}
