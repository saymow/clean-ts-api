export interface CheckSurveyById {
  execute: (id: string) => Promise<CheckSurveyById.Result>
}

export namespace CheckSurveyById {
  export type Result = boolean
}
