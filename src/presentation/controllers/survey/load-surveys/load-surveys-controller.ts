import { LoadSurveys, Controller, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'
import { serverError, ok } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadSurveys.execute())
    } catch (error) {
      return serverError(error)
    }
  }
}
