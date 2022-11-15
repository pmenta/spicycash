import { Router } from 'express'

import { CreateUserController } from '@/controllers/CreateUserController'
import { AuthenticationController } from '@/controllers/AuthenticationController'
import { GetBalanceController } from '@/controllers/GetBalanceController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { CashOutController } from '@/controllers/CashOutController'

const router = Router()

const createUserController = new CreateUserController()
const authenticationController = new AuthenticationController()
const getBalanceController = new GetBalanceController()
const cashOutController = new CashOutController()

router.post('/users', createUserController.handle)
router.post('/login', authenticationController.handle)
router.get('/balance', ensureAuthenticated, getBalanceController.handle)
router.post('/cashOut', ensureAuthenticated, cashOutController.handle)

export { router }
