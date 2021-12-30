import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  execute: () => Promise<SurveyModel[]>
}
