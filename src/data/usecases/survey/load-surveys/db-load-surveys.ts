import { LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) { }

  async execute (userId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll(userId)
  }
}
