import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import FakeObjectId from 'bson-objectid'

const mockAddSurveysParams = (): AddSurveyRepository.Params[] => ([mockAddSurveyParams(), mockAddSurveyParams()])

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())

  return insertedId.toHexString()
}

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    // environment variable set up by @shelf/jest-mongodb in-memory database
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
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
      const accountId = await makeAccountId()
      const result = await surveyCollection.insertMany(mockAddSurveysParams())
      const addedSurveys = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: addedSurveys._id,
        accountId: new ObjectId(accountId),
        answer: addedSurveys.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeDefined()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeDefined()
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty list on success', async () => {
      const accountId = await makeAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(0)
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.checkById(insertedId.toString())

      expect(survey).toBeTruthy()
    })

    test('Should return false if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(FakeObjectId().toHexString())

      expect(survey).toBeFalsy()
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
