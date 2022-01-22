import { AccountModel } from '@/domain//models/account'

export interface LoadAccountByToken {
  execute: (token: string, role?: string) => Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
  export type Result = AccountModel
}
