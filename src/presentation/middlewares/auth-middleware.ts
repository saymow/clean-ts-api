import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { unauthorized } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    if (!accessToken) {
      return unauthorized()
    }

    await this.loadAccountByToken.execute(accessToken)
  }
}
