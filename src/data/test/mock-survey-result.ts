import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  surveyResultParams: SaveSurveyResultRepository.Params

  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.surveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  userId: string
  result = mockSurveyResultModel()

  async loadBySurveyId (surveyId: string, userId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.userId = userId
    return await Promise.resolve(this.result)
  }
}
