import { LoadSurveyResult, LoadSurveyById, Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, userId } = httpRequest
      const survey = await this.loadSurveyById.execute(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.execute(surveyId, userId)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
