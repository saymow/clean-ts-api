import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidatorSpy } from '@/validation/test'
import { EmailValidation } from './email-validation'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)

  return { sut, emailValidatorSpy }
}

describe('EmailValidation', () => {
  test('Should  an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.bool = false
    const error = sut.validate({ email: 'any_email@mail.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    sut.validate({ email: 'any_email@mail.com' })

    expect(emailValidatorSpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)

    expect(sut.validate).toThrow()
  })
})
