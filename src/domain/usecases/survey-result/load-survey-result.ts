import { SurveyResultModel } from '../../models/survey-result'

export interface LoadSurveyResult {
  execute: (surveyId: string, userId: string) => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Result = SurveyResultModel
}
