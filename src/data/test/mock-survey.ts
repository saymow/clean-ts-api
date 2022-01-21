import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyData: AddSurveyParams
  surveyModel = mockSurveyModel()

  async add (surveyData: AddSurveyParams): Promise<SurveyModel> {
    this.addSurveyData = surveyData
    return await Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  surveyModel = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.surveyModel
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  userId: string
  surveyModels = mockSurveyModels()

  async loadAll (userId: string): Promise<SurveyModel[]> {
    this.userId = userId
    return this.surveyModels
  }
}
