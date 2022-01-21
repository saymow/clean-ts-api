import { LoadSurveysRepositorySpy } from '@/data/test'
import { mockSurveyModels, throwError } from '@/domain/test'
import mockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return { sut, loadSurveysRepositorySpy }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.execute('any_id')

    expect(loadSurveysRepositorySpy.userId).toBe('any_id')
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)

    await expect(sut.execute('any_id')).rejects.toThrow()
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.execute('any_id')

    expect(surveys).toEqual(mockSurveyModels())
  })
})
