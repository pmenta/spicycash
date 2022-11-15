import { AccountsRepository, IAccount } from '@/repositories/AccountsRepository'
import { prismaClient } from '@/database/prismaClient'

export class PrismaAccountsRepository implements AccountsRepository {
  async getByUserId (id: string): Promise<IAccount | null> {
    const account = await prismaClient.account.findFirst({
      where: {
        User: {
          id
        }
      }
    })

    return account
  }
}
