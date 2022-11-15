import { PrismaAccountsRepository } from '@/repositories/prisma/PrismaAccountsRepository'
import { GetBalanceService } from '@/services/Balance/GetBalanceService'
import { Request, Response } from 'express'

export class GetBalanceController {
  async handle (request: Request, response: Response): Promise<Response> {
    const token = request.headers.authorization as string
    const getBalanceService = new GetBalanceService(new PrismaAccountsRepository())

    const account = await getBalanceService.execute(token.substring(7))

    if (account.isLeft()) {
      return response.status(account.value._statusCode).json({ error: account.value._message })
    }

    return response.json({ ...account.value })
  }
}
