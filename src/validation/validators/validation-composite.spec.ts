import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/presentation/test'
import { ValidationComposite } from './validators-composite'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)

  return { sut, validationSpies }
}

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].result = new MissingParamError('otherField')
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('otherField'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].result = new MissingParamError('otherField')
    validationSpies[1].result = new InvalidParamError('otherField')
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('otherField'))
  })

  test('Should not if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
