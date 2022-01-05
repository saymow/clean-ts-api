import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<SurveyModel>
}
