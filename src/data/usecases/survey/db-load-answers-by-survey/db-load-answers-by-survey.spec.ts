import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

  return { sut, loadSurveyByIdRepositorySpy }
}

describe('DbLoadAnswersBySurvey useCase', () => {
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.execute('any_id')

    expect(loadSurveyByIdRepositorySpy.id).toBe('any_id')
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)

    await expect(sut.execute('any_id')).rejects.toThrow()
  })

  test('Should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const answers = await sut.execute('any_id')

    expect(answers).toBeNull()
  })

  test('Should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.execute('any_id')

    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answer,
      loadSurveyByIdRepositorySpy.result.answers[1].answer
    ])
  })
})
