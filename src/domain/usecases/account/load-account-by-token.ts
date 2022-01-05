import { AccountModel } from '@/domain//models/account'

export interface LoadAccountByToken {
  execute: (token: string, role?: string) => Promise<AccountModel>
}
