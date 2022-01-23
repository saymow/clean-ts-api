import { DbCheckSurveyById } from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
  return new DbCheckSurveyById(new SurveyMongoRepository())
}
