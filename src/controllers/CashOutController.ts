import { PrismaAccountsRepository } from '@/repositories/prisma/PrismaAccountsRepository'
import { CashOutService } from '@/services/CashOut'
import { Request, Response } from 'express'

export class CashOutController {
  async handle (request: Request, response: Response): Promise<Response> {
    const userId = request.userId
    const { amount, receiverUsername } = request.body
    const cashOutService = new CashOutService(new PrismaAccountsRepository())

    const transaction = await cashOutService.execute({ userId, amount, receiverUsername })

    if (transaction.isLeft()) {
      return response.status(transaction.value._statusCode).json({ error: transaction.value._message })
    }

    return response.json(true)
  }
}
