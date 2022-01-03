import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { Collection } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeFakeAddSurvey = (): AddSurveyModel => ({
  question: 'any question',
  answers: [
    {
      answer: 'any_answer 1',
      image: 'any_image 1'
    },
    {
      answer: 'any_answer 2'
    }
  ],
  date: new Date()
})

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const { insertedId } = await surveyCollection.insertOne(makeFakeAddSurvey())
  const survey = await surveyCollection.findOne(insertedId)

  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
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
  })
})
