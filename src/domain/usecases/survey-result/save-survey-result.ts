import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResult {
  execute: (data: SaveSurveyResult.Params) => Promise<SurveyResultModel>
}

export namespace SaveSurveyResult {
  export type Params = {
    surveyId: string
    accountId: string
    answer: string
    date: Date
  }

  export type Result = SurveyResultModel
}
