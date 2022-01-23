import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params
  result = true

  async execute (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return await Promise.resolve(this.result)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  result = mockAuthenticationModel()

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authentication
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  token: string
  role?: string
  result = mockAccountModel()

  async execute (token: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.result)
  }
}
