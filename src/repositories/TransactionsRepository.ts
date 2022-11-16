import { Prisma } from '@prisma/client'

export interface ITransaction {
  id: string
  value: Prisma.Decimal
  debitedAccountId: string
  creditedAccountId: string
  createdAt: Date
}

export interface TransactionsRepository {
  get: (id: string, order?: Prisma.SortOrder, only?: 'debited' | 'credited') => Promise<ITransaction[]>
}
