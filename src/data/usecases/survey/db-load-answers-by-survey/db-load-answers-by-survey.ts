import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { LoadAnswersBySurvey } from './db-load-answers-by-survey-protocols'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (
    private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
  ) { }

  async execute (id: string): Promise<LoadAnswersBySurvey.Result> {
    const answers = await this.loadAnswersBySurveyRepository.loadAnswers(id)

    if (!answers) return null

    return answers
  }
}
