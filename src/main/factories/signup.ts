import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Validation } from '../../presentation/helpers/validators/validation'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12

  return new LogControllerDecorator(
    new SignUpController(
      new EmailValidatorAdapter(),
      new DbAddAccount(new BcryptAdapter(salt), new AccountMongoRepository()),
      { validate: (input: any): Error => null } as Validation
    ),
    new LogMongoRepository()
  )
}
