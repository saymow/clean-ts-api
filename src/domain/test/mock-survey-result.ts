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
        count: 1,
        percent: 10,
        image: 'any_image'
      },
      {
        answer: 'other_answer',
        count: 9,
        percent: 90
      }
    ],
    date: new Date()
  })
