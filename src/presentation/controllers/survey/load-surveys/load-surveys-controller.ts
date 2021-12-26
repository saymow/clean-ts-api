import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { serverError, ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadSurveys.execute())
    } catch (err) {
      return serverError(err)
    }
  }
}
