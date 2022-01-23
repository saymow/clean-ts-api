export interface LoadAnswersBySurvey {
  execute: (id: string) => Promise<LoadAnswersBySurvey.Result>
}

export namespace LoadAnswersBySurvey {
  export type Result = string[]
}
