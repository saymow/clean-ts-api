import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, body: { answer } } = httpRequest
      const survey = await this.loadSurveyById.execute(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyAnswer = survey.answers.find(_surveyAnswer => _surveyAnswer.answer === answer)

      if (!surveyAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
