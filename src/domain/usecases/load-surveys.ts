import { SurveyModel } from '../models/survey'

export interface LoadSurveys {
  execute: () => Promise<SurveyModel[]>
}
