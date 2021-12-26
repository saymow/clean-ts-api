import { serverError } from '../../../helpers/http/http-helper'
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

  it('Should return 500 if LoadSurveys throws', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async execute (): Promise<SurveyModel[]> {
        return []
      }
    }
    const loadSurveyStub = new LoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveyStub)
    jest.spyOn(loadSurveyStub, 'execute').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
