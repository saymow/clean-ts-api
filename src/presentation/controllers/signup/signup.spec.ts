import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
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
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }

      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        password: 'any_pass',
        passwordConfirmation: 'invalid_pass'
      }
    }

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if no passwordConfirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        name: 'any',
        password: 'any_pass'
      }
    }

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if an invalid email is provided', () => {
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

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(400)
    expect(httpReponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
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

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@any.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
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

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(500)
    expect(httpReponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
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

    const httpReponse = sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(500)
    expect(httpReponse.body).toEqual(new ServerError())
  })

  it('Should call addAcount with correct value', () => {
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

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any',
      email: 'any_email@mail.com',
      password: 'any_pass'
    })
  })
})
