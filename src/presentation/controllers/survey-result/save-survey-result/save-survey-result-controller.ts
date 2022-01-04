import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId, params: { surveyId }, body: { answer } } = httpRequest
      const survey = await this.loadSurveyById.execute(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyAnswer = survey.answers.find(_surveyAnswer => _surveyAnswer.answer === answer)

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
