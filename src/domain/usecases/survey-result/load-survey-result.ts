import { SurveyResultModel } from '../../models/survey-result'

export interface LoadSurveyResult {
  execute: (surveyId: string, userId: string) => Promise<SurveyResultModel>
}
