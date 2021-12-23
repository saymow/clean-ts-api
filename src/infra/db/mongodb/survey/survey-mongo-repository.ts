import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const { insertedId } = await surveyCollection.insertOne(surveyData)
    const survey = await surveyCollection.findOne(insertedId)

    return MongoHelper.map(survey)
  }
}
