import { prismaClient } from '@/database/prismaClient'
import { ITransaction, TransactionsRepository } from '@/repositories/TransactionsRepository'
import { Prisma } from '@prisma/client'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async get (id: string, order: Prisma.SortOrder | undefined = 'desc', only?: 'debited' | 'credited'): Promise<ITransaction[]> {
    const transactions = await prismaClient.transaction.findMany({
      include: {
        creditedAccount: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        },
        debitedAccount: {
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: order
      },
      where: only === 'credited'
        ? {
            creditedAccountId: id
          }
        : only === 'debited'
          ? {
              debitedAccountId: id
            }
          : {
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
