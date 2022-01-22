import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '../usecases/account/authentication'

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationModel = (): Authentication.Result => ({
  name: 'any_name',
  accessToken: 'any_token'
})

export const mockAddAccountParams = (): AddAccount.Params => Object.assign(
  mockAuthenticationParams(),
  { name: 'any_name' }
)

export const mockAccountModel = (): AccountModel => Object.assign(
  mockAddAccountParams(),
  { id: 'any_id', password: 'any_hashed_password' }
)
