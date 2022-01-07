import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { accountId, surveyId, answer, date } = data
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')

    const response = await surveyResultCollection.findOneAndUpdate(
      { accountId, surveyId },
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )

    return response.value && MongoHelper.map(response.value)
  }
}
