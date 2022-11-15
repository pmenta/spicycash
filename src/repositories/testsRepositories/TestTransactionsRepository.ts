import { ITransaction, TransactionsRepository } from '@/repositories/TransactionsRepository'
import { TestAccountsRepository } from './TestAccountsRepository'

export class TestTransactionsRepository implements TransactionsRepository {
  constructor (private readonly accountsRepository: TestAccountsRepository) {}

  async get (id: string): Promise<ITransaction[]> {
    const account = await this.accountsRepository.getByUserId(id)
    const transactions = this.accountsRepository.transactions.filter(transaction => transaction.debitedAccountId === account.id || transaction.creditedAccountId === account.id)

    return transactions
  }
}
