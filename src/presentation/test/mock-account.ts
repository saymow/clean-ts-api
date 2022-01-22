import { AccountModel } from '@/domain/models/account'
import { AuthenticationModel } from '@/domain/models/authentication'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params
  bool = true

  async execute (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return await Promise.resolve(this.bool)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel = mockAuthenticationModel()

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authentication
    return this.authenticationModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  token: string
  role?: string
  accountModel = mockAccountModel()

  async execute (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.accountModel)
  }
}
