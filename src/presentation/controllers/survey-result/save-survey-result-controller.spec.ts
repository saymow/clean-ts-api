import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { HttpRequest } from '@/presentation/protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
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
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async execute (id: string): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}

describe('SaveSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'execute')
    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
