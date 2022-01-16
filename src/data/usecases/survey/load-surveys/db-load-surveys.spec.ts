import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveyModels, throwError } from '@/domain/test'
import mockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.execute('any_id')

    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)

    await expect(sut.execute('any_id')).rejects.toThrow()
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.execute('any_id')

    expect(surveys).toEqual(mockSurveyModels())
  })
})
