import { AddSurveyRepositorySpy } from '@/data/test'
import { mockAddSurveyParams, throwError } from '@/domain/test'
import mockDate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)

  return { sut, addSurveyRepositorySpy }
}

describe('AddSurvey UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const surveyData = mockAddSurveyParams()
    await sut.execute(surveyData)

    expect(addSurveyRepositorySpy.addSurveyData).toBe(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError)

    await expect((sut.execute(mockAddSurveyParams()))).rejects.toThrow()
  })
})
