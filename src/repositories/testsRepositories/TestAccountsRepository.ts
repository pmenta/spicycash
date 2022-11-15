import { Account } from '@prisma/client'

import { AccountsRepository, IAccount } from '@/repositories/AccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'

export class TestAccountsRepository implements AccountsRepository {
  constructor (private readonly usersRepository: TestUsersRepository) {}

  async getByUserId (id: string): Promise<IAccount> {
    const user = this.usersRepository.users.find(user => user.id === id)

    const account = this.usersRepository.accounts.find(account => account.id === user?.accountId) as Account

    return account
  }
}
