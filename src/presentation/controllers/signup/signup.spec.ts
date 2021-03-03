import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { SignUpController } from './signup'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        password: 'any_pass',
        passwordConfirmation: 'invalid_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if no passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        password: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalid_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@any.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(500)
    expect(httpReponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(500)
    expect(httpReponse.body).toEqual(new ServerError())
  })

  it('Should call addAcount with correct value', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any',
      email: 'any_email@mail.com',
      password: 'any_pass'
    })
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(200)
    expect(httpReponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  it('Should call Validtaion with correct value', async () => {
    const { sut, validationStub } = makeSut()

    const validateSyp = jest.spyOn(validationStub, 'validate')

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)

    expect(validateSyp).toHaveBeenCalledWith({
      name: 'any',
      email: 'any_email@mail.com',
      password: 'any_pass',
      passwordConfirmation: 'any_pass'
    })
  })
})
