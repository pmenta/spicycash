import { Request, Response } from 'express'
import { CreateUserService } from '@/services/User/CreateUserService'
import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository'

export class CreateUserController {
  async handle (request: Request, response: Response): Promise<Response<void>> {
    const { username, password } = request.body

    const createUserService = new CreateUserService(new PrismaUsersRepository())

    const user = await createUserService.execute({ username, password })

    if (user.isLeft()) {
      return response.status(user.value._statusCode).json({ error: user.value._message })
    }

    return response.json({ ...user.value })
  }
}
