import { ServerError, UnauthorizedError } from '../../errors'
import { HttpResponse } from '../../protocols/http'

export const ok = (body: any): HttpResponse => ({
  body,
  statusCode: 200
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
