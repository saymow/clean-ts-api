import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  saveSurveyResultParams: SaveSurveyResult.Params
  result = mockSurveyResultModel()

  async execute (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  userId: string
  result = mockSurveyResultModel()

  async execute (surveyId: string, userId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.userId = userId
    return this.result
  }
}
