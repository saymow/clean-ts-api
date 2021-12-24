import { unauthorized } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

describe('Auth Middleware', () => {
  test('Should return 401 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async execute (token: string): Promise<AccountModel> {
        return await Promise.resolve(makeFakeAccount())
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async execute (token: string): Promise<AccountModel> {
        return await Promise.resolve(makeFakeAccount())
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'execute')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    } as HttpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
