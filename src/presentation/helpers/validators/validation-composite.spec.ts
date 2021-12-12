import { ValidationComposite } from './validators-composite'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new MissingParamError('otherField')
      }
    }
    const validationStub = new ValidationStub()

    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('otherField'))
  })
})
