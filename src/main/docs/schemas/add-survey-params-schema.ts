export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answers: {
      type: '',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  },
  required: ['question', 'date', 'answers']
}
