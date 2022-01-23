import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  input: any
  result: Error = null

  validate (input: any): Error {
    this.input = input
    return this.result
  }
}
