import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyRepository.Params) => Promise<AddSurveyRepository.Result>
}

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
  export type Result = SurveyModel
}
