import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { LoadSurveysController } from './load-survey'

describe('LoadSurveys Controller', () => {
  it('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async execute (): Promise<SurveyModel[]> {
        return []
      }
    }
    const loadSurveyStub = new LoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveyStub)
    const loadSpy = jest.spyOn(loadSurveyStub, 'execute')
    await sut.handle({})

    expect(loadSpy).toHaveBeenCalledTimes(1)
  })
})
