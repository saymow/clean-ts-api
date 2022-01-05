export type AddSurveyAnswerParams = {
  image?: string
  answer: string
}

export type AddSurveyParams = {
  question: string
  answers: AddSurveyAnswerParams[]
  date: Date
}

export interface AddSurvey {
  execute: (data: AddSurveyParams) => Promise<void>
}
