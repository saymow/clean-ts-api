export type AddSurveyAnswerModel = {
  image?: string
  answer: string
}

export type AddSurveyModel = {
  question: string
  answers: AddSurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  execute: (data: AddSurveyModel) => Promise<void>
}
