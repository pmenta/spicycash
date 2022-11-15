import { Router } from 'express'
import { CreateUserController } from '@/controllers/CreateUserController'
import { AuthenticationController } from '@/controllers/AuthenticationController'
import { GetBalanceController } from '@/controllers/GetBalanceController'

const router = Router()

const createUserController = new CreateUserController()
const authenticationController = new AuthenticationController()
const getBalanceController = new GetBalanceController()

router.post('/users', createUserController.handle)
router.post('/login', authenticationController.handle)
router.get('/balance', getBalanceController.handle)

export { router }
