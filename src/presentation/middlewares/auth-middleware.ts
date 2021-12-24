import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { forbidden, unauthorized } from '../helpers/http/http-helper'
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

    const user = await this.loadAccountByToken.execute(accessToken)

    if (!user) {
      return forbidden(new AccessDeniedError())
    }
  }
}
