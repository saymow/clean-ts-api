import { LoadSurveyResultRepository, SaveSurveyResult, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async execute (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    const { surveyId, accountId } = data

    await this.saveSurveyResultRepository.save(data)

    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
  }
}
