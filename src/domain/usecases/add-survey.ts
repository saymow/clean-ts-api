export interface AddSurveyAnswer {
  image: string
  answer: string
}

export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswer[]
}

export interface AddSurvey {
  execute: (data: AddSurveyModel) => Promise<void>
}
