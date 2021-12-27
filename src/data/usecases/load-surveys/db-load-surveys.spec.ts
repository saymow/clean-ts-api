import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'
import mockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any question',
    answers: [
      {
        answer: 'any_answer 1',
        image: 'any_image 1'
      },
      {
        answer: 'any_answer 2'
      }
    ],
    date: new Date()
  },
  {
    id: 'any_id 2',
    question: 'any question 2',
    answers: [
      {
        answer: 'any_answer 1',
        image: 'any_image 1'
      },
      {
        answer: 'any_answer 2'
      }
    ],
    date: new Date()
  }
])

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveysRepository once', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return makeFakeSurveys()
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    await sut.execute()

    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return makeFakeSurveys()
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    jest.spyOn(loadSurveysRepositoryStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    await expect(sut.execute()).rejects.toThrow()
  })
})
