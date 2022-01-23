import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import mockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultsRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultsRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultsRepositorySpy, loadSurveyByIdRepositorySpy)

  return { sut, loadSurveyResultsRepositorySpy, loadSurveyByIdRepositorySpy }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultsRepositorySpy } = makeSut()
    await sut.execute('any_survey_id', 'any_user_id')

    expect(loadSurveyResultsRepositorySpy.surveyId).toBe('any_survey_id')
    expect(loadSurveyResultsRepositorySpy.userId).toBe('any_user_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultsRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultsRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)

    await expect(sut.execute('any_survey_id', 'any_user_id')).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository with correct values if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultsRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultsRepositorySpy.result = null
    await sut.execute('any_survey_id', 'any_user_id')

    expect(loadSurveyByIdRepositorySpy.id).toBe('any_survey_id')
  })

  test('Should load surveyResult with all answers having count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultsRepositorySpy } = makeSut()
    loadSurveyResultsRepositorySpy.result = null
    const surveyResult = await sut.execute('any_survey_id', 'any_user_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.execute('any_survey_id', 'any_user_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
