import { CheckSurveyById, CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (
    private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository
  ) { }

  async execute (id: string): Promise<CheckSurveyById.Result> {
    return await this.checkSurveyByIdRepository.checkById(id)
  }
}
