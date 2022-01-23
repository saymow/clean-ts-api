import { LoadAnswersBySurveyRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

  return { sut, loadAnswersBySurveyRepositorySpy }
}

describe('DbLoadAnswersBySurvey useCase', () => {
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    await sut.execute('any_id')

    expect(loadAnswersBySurveyRepositorySpy.id).toBe('any_id')
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)

    await expect(sut.execute('any_id')).rejects.toThrow()
  })

  test('Should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = null
    const answers = await sut.execute('any_id')

    expect(answers).toBeNull()
  })

  test('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.execute('any_id')

    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1]
    ])
  })
})
