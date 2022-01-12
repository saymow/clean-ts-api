import { accountSchema } from './account-schema'
import { addSurveyParamsSchema } from './add-survey-params-schema'
import { errorSchema } from './error-schema'
import { loginParamsSchema } from './login-params-schema'
import { saveSurveyResultParamsSchema } from './save-survey-result-params-schema'
import { signupParamsSchema } from './signup-params-schema'
import { surveyAnswerSchema } from './survey-answer-schema'
import { surveyResultAnswerSchema } from './survey-result-answer-schema'
import { surveyResultSchema } from './survey-result-schema'
import { surveySchema } from './survey-schema'
import { surveysSchema } from './surveys-schema'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signupParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
