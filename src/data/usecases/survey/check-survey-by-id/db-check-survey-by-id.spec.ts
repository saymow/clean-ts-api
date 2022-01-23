import { CheckSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { DbCheckSurveyById } from './db-check-survey-by-id'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return { sut, checkSurveyByIdRepositorySpy }
}

describe('DbCheckSurveyById useCase', () => {
  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.execute('any_id')

    expect(checkSurveyByIdRepositorySpy.id).toBe('any_id')
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)

    await expect(sut.execute('any_id')).rejects.toThrow()
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const survey = await sut.execute('any_id')

    expect(survey).toBeTruthy()
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const survey = await sut.execute('any_id')

    expect(survey).toBeFalsy()
  })
})
