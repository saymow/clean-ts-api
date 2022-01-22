import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => Object.assign({ id: 'any_id' }, mockAddSurveyParams())

export const mockSurveyModels = (): SurveyModel[] => ([mockSurveyModel(), mockSurveyModel()])
