import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator
  private readonly fieldName: string

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}