export interface AddSurveyAnswerModel {
  image?: string
  answer: string
}

export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswerModel[]
}

export interface AddSurvey {
  execute: (data: AddSurveyModel) => Promise<void>
}
