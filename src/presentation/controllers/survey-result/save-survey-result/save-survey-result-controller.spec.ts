import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyByIdStub, mockSaveSurveyResult } from '@/presentation/test'
import mockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => ({
  userId: 'any_id',
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'any_answer'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'execute')
    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should returns 403 if LoadSurveyById does not find a survey', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'execute').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'execute').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: { surveyId: 'any_id' },
      body: { answer: 'invalid_answer' }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'execute')
    await sut.handle(mockRequest())

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'execute').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
