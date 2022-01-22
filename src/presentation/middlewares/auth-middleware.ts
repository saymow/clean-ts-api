import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { HttpResponse, LoadAccountByToken, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request

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

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
