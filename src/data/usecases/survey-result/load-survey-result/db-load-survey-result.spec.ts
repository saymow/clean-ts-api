import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockLoadSurveyByRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import mockDate from 'mockdate'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultsRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultsRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultsRepositoryStub, loadSurveyByIdRepositoryStub)

  return { sut, loadSurveyResultsRepositoryStub, loadSurveyByIdRepositoryStub }
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
    await sut.execute('any_survey_id', 'any_user_id')

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_user_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultsRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultsRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)

    await expect(sut.execute('any_survey_id', 'any_user_id')).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository with correct values if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultsRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultsRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(null)
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.execute('any_survey_id', 'any_user_id')

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.execute('any_survey_id', 'any_user_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
