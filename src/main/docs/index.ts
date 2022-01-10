import components from './components'
import paths from './paths'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso do mango.',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      tag: 'Autenticação'
    },
    {
      tag: 'Enquete'
    }
  ],
  paths,
  schemas,
  components
}
