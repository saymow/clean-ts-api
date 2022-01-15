import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

const surveyToEmptySurveyResultMapper = (survey: SurveyModel): SurveyResultModel => ({
  surveyId: survey.id,
  date: survey.date,
  question: survey.question,
  answers: survey.answers.map((answer) =>
    Object.assign(
      answer,
      { count: 0, percent: 0 }
    ))
})
export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async execute (surveyId: string, userId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, userId)

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)

      surveyResult = surveyToEmptySurveyResultMapper(survey)
    }

    return surveyResult
  }
}
