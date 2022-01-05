import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { forbidden, unauthorized, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (!accessToken) {
        return unauthorized()
      }

      const user = await this.loadAccountByToken.execute(accessToken, this.role)

      if (!user) {
        return forbidden(new AccessDeniedError())
      }

      return ok({ userId: user.id })
    } catch (error) {
      return serverError(error)
    }
  }
}
