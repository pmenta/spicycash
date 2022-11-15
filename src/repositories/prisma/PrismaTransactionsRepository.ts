import { prismaClient } from '@/database/prismaClient'
import { ITransaction, TransactionsRepository } from '@/repositories/TransactionsRepository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async get (id: string): Promise<ITransaction[]> {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        OR: [
          {
            debitedAccountId: id
          },
          {
            creditedAccountId: id
          }
        ]
      }
    })

    return transactions
  }
}
