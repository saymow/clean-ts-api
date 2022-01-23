import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/presentation/test'
import mockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'

const mockRequest = (answer: string): SaveSurveyResultController.Request => ({
  userId: 'any_id',
  surveyId: 'any_id',
  answer
})

type SutTypes = {
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy)

  return { sut, loadAnswersBySurveySpy, saveSurveyResultSpy }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))

    expect(loadAnswersBySurveySpy.id).toBe('any_id')
  })

  test('Should returns 403 if LoadAnswersBySurvey does not find a survey', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    loadAnswersBySurveySpy.result = null
    const httpResponse = await sut.handle(mockRequest('any_answer'))

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'execute').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      userId: 'any_id',
      surveyId: 'any_id',
      answer: 'invalid_answer'
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(request)

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      accountId: request.userId,
      answer: request.answer,
      date: new Date(),
      surveyId: request.surveyId
    })
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'execute').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))

    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
