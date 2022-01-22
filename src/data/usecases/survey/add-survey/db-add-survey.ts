import { AddSurveyRepository, AddSurvey } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) { }

  async execute (data: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
