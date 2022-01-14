import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
  const survey = await surveyCollection.findOne(insertedId)

  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
  const account = await accountCollection.findOne(insertedId)

  return MongoHelper.map(account)
}

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async () => {
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

  describe('save()', () => {
    test('Should return add survey result if its new', async () => {
      const { id: surveyId, answers: [{ answer }] } = await makeSurvey()
      const { id: accountId } = await makeAccount()
      const sut = makeSut()

      await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      const surveyResult = await surveyCollection.findOne({
        surveyId,
        accountId
      })

      expect(surveyResult).toBeDefined()
    })

    test('Should update survey result if exits', async () => {
      const { id: surveyId, answers: [{ answer: firstAnswer }, { answer: secondAnswer }] } = await makeSurvey()
      const { id: accountId } = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: firstAnswer,
        date: new Date()
      })
      const sut = makeSut()

      await sut.save({
        surveyId,
        accountId,
        answer: secondAnswer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection
        .find({ surveyId: new ObjectId(surveyId), accountId: new ObjectId(accountId) })
        .toArray()

      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const { id: surveyId, answers: [{ answer: firstAnswer }] } = await makeSurvey()
      const { id: accountId } = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: firstAnswer,
        date: new Date()
      })
      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)

      expect(surveyResult).toBeDefined()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers[0].answer).toBe(firstAnswer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })
})
