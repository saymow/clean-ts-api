import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const ok = (body: any): HttpResponse => ({
  body,
  statusCode: 200
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
