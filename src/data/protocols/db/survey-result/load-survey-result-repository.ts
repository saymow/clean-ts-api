import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, userId: string) => Promise<LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel
}
