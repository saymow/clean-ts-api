import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { Collection } from 'mongodb'

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

const makeFakeAddSurveys = (): AddSurveyModel[] => ([makeFakeAddSurvey(), makeFakeAddSurvey()])

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
      const survey = await sut.add(makeFakeAddSurvey())

      expect(survey).toBeDefined()
      expect(survey.id).toBeDefined()
      expect(survey.question).toEqual('any question')
      expect(survey.answers[0]).toEqual(expect.objectContaining({
        image: 'any_image 1',
        answer: 'any_answer 1'
      }))
      expect(survey.answers[1]).toEqual(expect.objectContaining({
        answer: 'any_answer 2'
      }))
    })
  })

  describe('loadAll()', () => {
    test('Should return surveys on success', async () => {
      await surveyCollection.insertMany(makeFakeAddSurveys())
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any question')
    })

    test('Should return an empty list on success', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(0)
    })
  })
})
