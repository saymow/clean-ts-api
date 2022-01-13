import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import mockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultsRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultsRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultsRepositoryStub)

  return { sut, loadSurveyResultsRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultsRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultsRepositoryStub, 'loadBySurveyId')
    await sut.execute('any_survey_id')

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultsRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultsRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)

    await expect(sut.execute('any_survey_id')).rejects.toThrow()
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.execute('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
