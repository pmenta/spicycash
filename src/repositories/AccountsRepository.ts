import { Prisma } from '@prisma/client'

export interface IAccount {
  id: string
  balance: Prisma.Decimal
}

export interface ICashOutRequest {
  receiver: string
  sender: string
  senderBalance: Prisma.Decimal
  receiverBalance: Prisma.Decimal
  amount: Prisma.Decimal
}

export interface AccountsRepository {
  getByUserId: (id: string) => Promise<IAccount | null>
  getByUsername: (username: string) => Promise<IAccount | null>
  cashOut: ({ receiver, sender, amount, receiverBalance, senderBalance }: ICashOutRequest) => Promise<boolean>
}
