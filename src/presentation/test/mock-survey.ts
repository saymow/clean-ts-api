import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async execute (data: AddSurveyParams): Promise<void> {
      return null
    }
  }

  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async execute (userId: 'any_id'): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysStub()
}

export const mockLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async execute (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}
