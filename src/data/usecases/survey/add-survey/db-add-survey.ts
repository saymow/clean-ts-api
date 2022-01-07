import { AddSurveyRepository, AddSurveyParams, AddSurvey } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) { }

  async execute (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
