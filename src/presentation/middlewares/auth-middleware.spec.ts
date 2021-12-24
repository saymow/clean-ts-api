import { unauthorized } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 401 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(unauthorized())
  })
})
