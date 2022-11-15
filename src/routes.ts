import { Router } from 'express'
import { CreateUserController } from '@/controllers/CreateUserController'
import { AuthenticationController } from '@/controllers/AuthenticationController'

const router = Router()

const createUserController = new CreateUserController()
const authenticationController = new AuthenticationController()

router.post('/users', createUserController.handle)
router.post('/login', authenticationController.handle)

export { router }
