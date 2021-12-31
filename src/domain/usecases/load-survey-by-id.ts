import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  execute: () => Promise<SurveyModel>
}
