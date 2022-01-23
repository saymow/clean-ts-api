import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyModel, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async execute (surveyId: string, userId: string): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, userId)

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)

      surveyResult = this.makeEmptyResult(survey)
    }

    return surveyResult
  }

  private makeEmptyResult (survey: SurveyModel): SurveyResultModel {
    return {
      surveyId: survey.id,
      date: survey.date,
      question: survey.question,
      answers: survey.answers.map((answer) =>
        Object.assign(
          answer,
          { count: 0, percent: 0, isCurrentAccountAnswer: false }
        ))
    }
  }
}
