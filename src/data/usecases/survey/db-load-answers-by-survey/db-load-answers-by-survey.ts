import { LoadAnswersBySurvey, LoadSurveyByIdRepository } from './db-load-answers-by-survey-protocols'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async execute (id: string): Promise<LoadAnswersBySurvey.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)

    if (!survey) return null

    return survey.answers.map(a => a.answer)
  }
}
