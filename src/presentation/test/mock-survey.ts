import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModels } from '@/domain/test'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answer-by-survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import faker from 'faker'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async execute (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return null
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  userId: string
  result = mockSurveyModels()

  async execute (userId: 'any_id'): Promise<SurveyModel[]> {
    this.userId = userId
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  id: string
  result = true

  async execute (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  id: string
  result = [faker.random.word(), faker.random.word()]

  async execute (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return this.result
  }
}
