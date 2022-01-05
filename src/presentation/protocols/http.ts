export type HttpRequest = {
  userId?: string
  headers?: any
  params?: any
  body?: any
}

export type HttpResponse = {
  statusCode: number
  body: any
}
