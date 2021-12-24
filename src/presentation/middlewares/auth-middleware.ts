import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { forbidden, unauthorized, ok } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (!accessToken) {
      return unauthorized()
    }

    const account = await this.loadAccountByToken.execute(accessToken)

    if (!account) {
      return forbidden(new AccessDeniedError())
    }

    return ok({ accountId: account.id })
  }
}
