import { PrismaAccountsRepository } from '@/repositories/prisma/PrismaAccountsRepository'
import { GetBalanceService } from '@/services/Balance/GetBalanceService'
import { Request, Response } from 'express'

export class GetBalanceController {
  async handle (request: Request, response: Response): Promise<Response> {
    const userId = request.userId
    const getBalanceService = new GetBalanceService(new PrismaAccountsRepository())

    const account = await getBalanceService.execute(userId)

    if (account.isLeft()) {
      return response.status(account.value._statusCode).json({ error: account.value._message })
    }

    return response.json({ ...account.value })
  }
}
