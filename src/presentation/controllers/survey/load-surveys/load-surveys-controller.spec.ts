import { mockSurveyModels, throwError } from '@/domain/test'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysSpy } from '@/presentation/test'
import mockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys-controller'

const mockRequest = (): LoadSurveysController.Request => ({
  userId: 'any_id'
})

type SutTypes = {
  loadSurveysSpy: LoadSurveysSpy
  sut: LoadSurveysController
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)

  return { sut, loadSurveysSpy }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  it('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    await sut.handle(mockRequest())

    expect(loadSurveysSpy.userId).toBe(mockRequest().userId)
  })

  it('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'execute').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.result = []
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })
})
