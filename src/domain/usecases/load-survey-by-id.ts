import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  execute: (id: string) => Promise<SurveyModel>
}
