import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
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

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async execute (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return { sut, loadSurveysStub }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'execute')
    await sut.handle({})

    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'execute').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'execute').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
})
