export interface AddSurvey {
  execute: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: AddSurveyAnswerParams[]
    date: Date
  }

  type AddSurveyAnswerParams = {
    image?: string
    answer: string
  }
}
