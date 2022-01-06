import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'any_answer 2'
    }
  ],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => Object.assign({ id: 'any_id' }, mockAddSurveyParams())

export const mockSurveyModels = (): SurveyModel[] => ([mockSurveyModel(), mockSurveyModel()])
