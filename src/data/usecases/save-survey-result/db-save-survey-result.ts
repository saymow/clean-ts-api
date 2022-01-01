import { SaveSurveyResult, SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async execute (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return null
  }
}
