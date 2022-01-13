import { SurveyResultModel } from '../../models/survey-result'

export interface LoadSurveyResult {
  execute: (surveyId: string) => Promise<SurveyResultModel>
}
