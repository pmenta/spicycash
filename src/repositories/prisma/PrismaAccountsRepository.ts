import { AccountsRepository, IAccount, ICashOutRequest } from '@/repositories/AccountsRepository'
import { prismaClient } from '@/database/prismaClient'

export class PrismaAccountsRepository implements AccountsRepository {
  async getByUserId (id: string): Promise<IAccount | null> {
    const account = await prismaClient.account.findFirst({
      where: {
        user: {
          id
        }
      }
    })

    return account
  }

  async getByUsername (username: string): Promise<IAccount | null> {
    const account = await prismaClient.account.findFirst({
      where: {
        user: {
          username
        }
      }
    })

    return account
  }

  async cashOut ({ receiver, sender, senderBalance, receiverBalance, amount }: ICashOutRequest): Promise<boolean> {
    await prismaClient.account.update({
      where: {
        id: receiver
      },
      data: {
        balance: receiverBalance
      }
    })

    await prismaClient.account.update({
      where: {
        id: sender
      },
      data: {
        balance: senderBalance
      }
    })

    await prismaClient.transaction.create({
      data: {
        value: amount,
        debitedAccountId: sender,
        creditedAccountId: receiver
      }
    })

    return true
  }
}
