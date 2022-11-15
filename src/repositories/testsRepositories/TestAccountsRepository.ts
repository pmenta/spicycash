import { Account, Prisma } from '@prisma/client'

import { AccountsRepository, IAccount, ICashOutRequest } from '@/repositories/AccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { randomUUID } from 'crypto'

interface ITransaction {
  id: string
  debitedAccount: string
  creditedAccount: string
  value: Prisma.Decimal
  createdAt: Date
}

export class TestAccountsRepository implements AccountsRepository {
  constructor (private readonly usersRepository: TestUsersRepository) {}

  public transactions: ITransaction[] = []

  async getByUserId (id: string): Promise<IAccount> {
    const user = this.usersRepository.users.find(user => user.id === id)

    const account = this.usersRepository.accounts.find(account => account.id === user?.accountId) as Account

    return account
  }

  async getByUsername (username: string): Promise<IAccount> {
    const user = this.usersRepository.users.find(user => user.username === username)

    const account = this.usersRepository.accounts.find(account => account.id === user?.accountId) as Account

    return account
  }

  async cashOut ({ amount, receiver, receiverBalance, sender, senderBalance }: ICashOutRequest): Promise<boolean> {
    const senderAccount = this.usersRepository.accounts.find(account => account.id === sender)
    const receiverAccount = this.usersRepository.accounts.find(account => account.id === receiver)

    if (!senderAccount || !receiverAccount) {
      return false
    }

    senderAccount.balance = senderBalance
    receiverAccount.balance = receiverBalance

    this.usersRepository.accounts.forEach((account, index) => {
      if (account.id === senderAccount.id) {
        this.usersRepository.accounts[index] = senderAccount
      }
    })

    const transaction = {
      id: randomUUID(),
      debitedAccount: sender,
      creditedAccount: receiver,
      value: amount,
      createdAt: new Date()
    }

    this.transactions.push(transaction)

    return true
  }
}
