import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection, ObjectId } from 'mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { AccountModel } from '@/domain/models/account'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

const mockAddSurveysParams = (): AddSurveyRepository.Params[] => ([mockAddSurveyParams(), mockAddSurveyParams()])

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
  const account = await accountCollection.findOne(insertedId)

  return MongoHelper.map(account)
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
      const account = await makeAccount()
      const result = await surveyCollection.insertMany(mockAddSurveysParams())
      const addedSurveys = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: addedSurveys._id,
        accountId: new ObjectId(account.id),
        answer: addedSurveys.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeDefined()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeDefined()
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty list on success', async () => {
      const account = await makeAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)

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
