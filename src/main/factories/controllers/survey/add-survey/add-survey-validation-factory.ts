import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('question'),
    new RequiredFieldValidation('answers')
  ])
}
