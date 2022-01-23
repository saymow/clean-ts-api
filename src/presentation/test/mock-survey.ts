import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async execute (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return null
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  userId: string
  surveyModels = mockSurveyModels()

  async execute (userId: 'any_id'): Promise<SurveyModel[]> {
    this.userId = userId
    return this.surveyModels
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  id: string
  result = true

  async execute (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  surveyModel = mockSurveyModel()

  async execute (id: string): Promise<SurveyModel> {
    this.id = id
    return this.surveyModel
  }
}
