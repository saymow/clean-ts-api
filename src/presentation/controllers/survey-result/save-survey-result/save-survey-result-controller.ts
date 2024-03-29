import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, LoadAnswersBySurvey, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { userId, surveyId, answer } = request
      const answers = await this.loadAnswersBySurvey.execute(surveyId)

      if (!answers) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyAnswer = answers.find(a => a === answer)

      if (!surveyAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.execute({
        answer,
        accountId: userId,
        date: new Date(),
        surveyId: surveyId
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    userId: string
    answer: string
  }
}
