import { SaveSurveyResult, LoadSurveyResultRepository, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async execute (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { surveyId, accountId } = data

    await this.saveSurveyResultRepository.save(data)

    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
  }
}
