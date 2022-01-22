import { LogErrorRepositorySpy } from '@/data/test'
import { mockAccountModel } from '@/domain/test'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import faker from 'faker'
import { LogControllerDecorator } from './log-controller-decorator'

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel())
  request: any

  async handle (httpRequest: any): Promise<HttpResponse> {
    this.request = httpRequest
    return await Promise.resolve(this.httpResponse)
  }
}

const mockRequest = (): any => faker.lorem.sentence()

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return { sut, controllerSpy, logErrorRepositorySpy }
}

describe('LogController Decorator', () => {
  test('Should call controller handle method', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(controllerSpy.request).toEqual(request)
  })

  test('Should return controller returned value', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  test('Should call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    controllerSpy.httpResponse = mockServerError()
    await sut.handle(mockRequest())

    expect(logErrorRepositorySpy.plaintext).toBe('any_stack')
  })
})
