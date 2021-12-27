import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

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
      const now = new Date()
      const survey = await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: now
      })

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
      expect(survey.date).toEqual(now)
    })
  })
})
