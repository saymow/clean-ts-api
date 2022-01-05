import { AccountModel } from '@/domain/models/account'

export type AddAccountParams = {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  execute: (account: AddAccountParams) => Promise<AccountModel>
}
