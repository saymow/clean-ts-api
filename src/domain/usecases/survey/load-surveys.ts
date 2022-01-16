import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  execute: (userId: string) => Promise<SurveyModel[]>
}
