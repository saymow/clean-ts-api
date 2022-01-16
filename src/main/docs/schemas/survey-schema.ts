export const surveySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    date: { type: 'string' },
    didAnswer: { type: 'boolean' },
    answers: {
      type: '',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  },
  required: ['id', 'question', 'date', 'answers', 'didAnswer']
}
