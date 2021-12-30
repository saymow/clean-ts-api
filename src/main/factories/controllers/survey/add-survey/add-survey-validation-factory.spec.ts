import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('@/validation/validators/validators-composite')

describe('AddSurveyValidation factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = ['question', 'answers'].map((field) => new RequiredFieldValidation(field))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
