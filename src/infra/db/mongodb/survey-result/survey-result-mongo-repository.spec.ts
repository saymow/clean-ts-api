import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { Collection } from 'mongodb'
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

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      expect(surveyResult).toBeDefined()
      expect(surveyResult.id).toBeDefined()
      expect(surveyResult.answer).toBe(answer)
    })

    test('Should update survey result if exits', async () => {
      const { id: surveyId, answers: [{ answer: firstAnswer }, { answer: secondAnswer }] } = await makeSurvey()
      const { id: accountId } = await makeAccount()
      const { insertedId: insertedSurveyResultId } = await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: firstAnswer,
        date: new Date()
      })
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: secondAnswer,
        date: new Date()
      })

      expect(surveyResult).toBeDefined()
      expect(surveyResult.id).toEqual(insertedSurveyResultId.toHexString())
      expect(surveyResult.answer).toEqual(secondAnswer)
    })
  })
})
