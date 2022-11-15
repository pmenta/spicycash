import { PrismaAccountsRepository } from '@/repositories/prisma/PrismaAccountsRepository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/PrismaTransactionsRepository'
import { GetTransactionsService } from '@/services/Transactions'
import { Request, Response } from 'express'

export class TransactionsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const userId = request.userId
    const getTransactionsService = new GetTransactionsService(new PrismaTransactionsRepository(), new PrismaAccountsRepository())

    const transactions = await getTransactionsService.execute(userId)

    if (transactions.isLeft()) {
      return response.status(transactions.value._statusCode).json({ error: transactions.value._message })
    }

    return response.json({ ...transactions.value })
  }
}
