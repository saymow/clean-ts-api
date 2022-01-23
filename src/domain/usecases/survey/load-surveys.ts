import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  execute: (userId: string) => Promise<LoadSurveys.Result>
}

export namespace LoadSurveys {
  export type Result = SurveyModel[]
}
