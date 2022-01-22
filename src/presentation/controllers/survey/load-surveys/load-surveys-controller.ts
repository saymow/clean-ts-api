import { LoadSurveys, Controller, HttpResponse } from './load-surveys-controller-protocols'
import { serverError, ok, noContent } from '@/presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { userId } = request
      const surveys = await this.loadSurveys.execute(userId)

      if (!surveys.length) {
        return noContent()
      }

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    userId: string
  }
}
