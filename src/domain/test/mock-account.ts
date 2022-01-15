import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'
import { AuthenticationModel } from '@/domain/models/authentication'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  name: 'any_name',
  accessToken: 'any_token'
})

export const mockAddAccountParams = (): AddAccountParams => Object.assign(
  mockAuthenticationParams(),
  { name: 'any_name' }
)

export const mockAccountModel = (): AccountModel => Object.assign(
  mockAddAccountParams(),
  { id: 'any_id', password: 'any_hashed_password' }
)
