import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { mockAddSurveyParams } from '@/domain/test'

const mockAddSurveysParams = (): AddSurveyParams[] => ([mockAddSurveyParams(), mockAddSurveyParams()])

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Account Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    // environment variable set up by @shelf/jest-mongodb in-memory database
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an survey on add success', async () => {
      const sut = makeSut()
      const survey = await sut.add(mockAddSurveyParams())

      expect(survey).toBeDefined()
      expect(survey.id).toBeDefined()
      expect(survey.question).toEqual('any_question')
      expect(survey.answers[0]).toEqual(expect.objectContaining({
        image: 'any_image',
        answer: 'any_answer'
      }))
      expect(survey.answers[1]).toEqual(expect.objectContaining({
        answer: 'other_answer'
      }))
    })
  })

  describe('loadAll()', () => {
    test('Should return surveys on success', async () => {
      await surveyCollection.insertMany(mockAddSurveysParams())
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeDefined()
      expect(surveys[0].question).toBe('any_question')
    })

    test('Should return an empty list on success', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toString())

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
