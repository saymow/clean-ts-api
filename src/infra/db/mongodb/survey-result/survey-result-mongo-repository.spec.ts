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

const makeAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())

  return insertedId.toHexString()
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
      const accountId = await makeAccountId()
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
      const accountId = await makeAccountId()
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
      const accountId = await makeAccountId()
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
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 2', async () => {
      const { id: surveyId, answers: [{ answer: firstAnswer }, { answer: secondAnswer }] } = await makeSurvey()
      const accountId = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: firstAnswer,
        date: new Date()
      }, {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId2),
        answer: firstAnswer,
        date: new Date()
      }, {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId3),
        answer: secondAnswer,
        date: new Date()
      }])
      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(surveyId, accountId2)

      expect(surveyResult).toBeDefined()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers[0].answer).toBe(firstAnswer)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 3', async () => {
      const { id: surveyId, answers: [{ answer: firstAnswer }, { answer: secondAnswer }] } = await makeSurvey()
      const accountId = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: firstAnswer,
        date: new Date()
      }, {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId2),
        answer: secondAnswer,
        date: new Date()
      }])
      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(surveyId, accountId3)

      expect(surveyResult).toBeDefined()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if there is no survey result', async () => {
      const { id: surveyId } = await makeSurvey()
      const accountId = await makeAccountId()
      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)

      expect(surveyResult).toBeNull()
    })
  })
})
