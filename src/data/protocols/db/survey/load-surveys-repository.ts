import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll: (userId: string) => Promise<LoadSurveysRepository.Result>
}

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[]
}
