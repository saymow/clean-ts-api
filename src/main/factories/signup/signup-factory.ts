import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'
import ENV from '../../config/env'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()

  return new LogControllerDecorator(
    new SignUpController(
      new DbAddAccount(new BcryptAdapter(salt), accountMongoRepository),
      makeSignUpValidation(),
      new DbAuthentication(
        accountMongoRepository,
        new BcryptAdapter(salt),
        new JwtAdapter(ENV.JWT_SECRET),
        accountMongoRepository
      )
    ),
    new LogMongoRepository()
  )
}
