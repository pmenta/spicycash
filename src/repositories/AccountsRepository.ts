import { Prisma } from '@prisma/client'

export interface IAccount {
  id: string
  balance: Prisma.Decimal
}

export interface AccountsRepository {
  getByUserId: (id: string) => Promise<IAccount | null>
}
