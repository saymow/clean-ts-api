import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory'
import { makeDbCheckSurveyById } from '@/main/factories/usecases/survey/check-survey-by-id/db-check-survey-by-id'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult()))
}
