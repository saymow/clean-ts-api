import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { LoadAnswersBySurveyRepository } from '../protocols/db/survey/load-answers-by-survey-repository'
import faker from 'faker'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyData: AddSurveyRepository.Params
  result = mockSurveyModel()

  async add (surveyData: AddSurveyRepository.Params): Promise<SurveyModel> {
    this.addSurveyData = surveyData
    return await Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result = true

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result = mockSurveyModel()

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  id: string
  result = [faker.random.word(), faker.random.word()]

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  userId: string
  result = mockSurveyModels()

  async loadAll (userId: string): Promise<SurveyModel[]> {
    this.userId = userId
    return this.result
  }
}
