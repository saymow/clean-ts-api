import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helpers'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository {
  async add (surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const { insertedId } = await surveyCollection.insertOne(surveyData)
    const survey = await surveyCollection.findOne(insertedId)

    return MongoHelper.map(survey)
  }

  async loadAll (userId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      }).project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(userId)]
                }
              }
            }
          }, 1]
        }
      }).build()
    const surveys = await surveyCollection.aggregate(query).toArray()

    return MongoHelper.mapCollection(surveys)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne(new ObjectId(id), { projection: { _id: 1 } })

    return Boolean(survey)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne(new ObjectId(id))

    return survey && MongoHelper.map(survey)
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({ _id: new ObjectId(id) })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()

    console.log(surveys)

    return surveys[0]?.answers ?? null
  }
}
