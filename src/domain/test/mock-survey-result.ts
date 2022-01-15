import { SurveyResultModel } from '@/domain//models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel =>
  ({
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        count: 0,
        percent: 0,
        image: 'any_image'
      },
      {
        answer: 'other_answer',
        count: 0,
        percent: 0
      }
    ],
    date: new Date()
  })
