import { SurveyResultModel } from '@/domain//models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
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
        image: 'any_image',
        isCurrentAccountAnswer: false
      },
      {
        answer: 'other_answer',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }
    ],
    date: new Date()
  })
