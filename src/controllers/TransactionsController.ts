import { PrismaAccountsRepository } from '@/repositories/prisma/PrismaAccountsRepository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/PrismaTransactionsRepository'
import { GetTransactionsService } from '@/services/Transactions'
import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'

export class TransactionsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const userId = request.userId
    const { order, only } = request.query
    const getTransactionsService = new GetTransactionsService(new PrismaTransactionsRepository(), new PrismaAccountsRepository())

    const transactions = await getTransactionsService.execute(userId, order as Prisma.SortOrder, only as 'credited' | 'debited')

    if (transactions.isLeft()) {
      return response.status(transactions.value._statusCode).json({ error: transactions.value._message })
    }

    return response.json({ ...transactions.value })
  }
}
