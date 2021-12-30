import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoginController } from '@/main/factories/controllers/auth/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/auth/signup/signup-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
