export interface AddSurveyAnswerModel {
  image?: string
  answer: string
}

export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  execute: (data: AddSurveyModel) => Promise<void>
}
