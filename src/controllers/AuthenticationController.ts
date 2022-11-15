import { PrismaUsersRepository } from '@/repositories/prisma/PrismaUsersRepository'
import { AuthenticationService } from '@/services/Authentication'
import { Request, Response } from 'express'

export class AuthenticationController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body

    const authenticationService = new AuthenticationService(new PrismaUsersRepository())

    const user = await authenticationService.execute({ username, password })

    if (user.isLeft()) {
      return response.status(user.value._statusCode).json({ error: user.value._message })
    }

    return response.json({ ...user.value })
  }
}
