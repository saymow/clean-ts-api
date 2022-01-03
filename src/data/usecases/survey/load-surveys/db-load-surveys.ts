import { SurveyModel, LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) { }

  async execute (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}
