import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => Object.assign(
  mockAuthenticationParams(),
  { name: 'any_name' }
)

export const mockAccountModel = (): AccountModel => Object.assign(
  mockAddAccountParams(),
  { id: 'any_id', password: 'any_hashed_password' }
)
