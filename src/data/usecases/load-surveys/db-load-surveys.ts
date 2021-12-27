import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) { }

  async execute (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.load()
  }
}
