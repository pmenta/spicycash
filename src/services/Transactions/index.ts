import { Either, left, right } from '@/errors/either'
import { RequiredParametersError } from '@/errors/requiredParametersError'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { ITransaction, TransactionsRepository } from '@/repositories/TransactionsRepository'
import { Prisma } from '@prisma/client'

type IGetTransactionsResponse = ITransaction[]
export type IResponse = Either<RequiredParametersError, IGetTransactionsResponse>

export class GetTransactionsService {
  constructor (private readonly transactionsRepository: TransactionsRepository, private readonly accountsRepository: AccountsRepository) {}

  async execute (id: string, order?: Prisma.SortOrder, only?: 'debited' | 'credited'): Promise<IResponse> {
    if (!id) {
      return left(new RequiredParametersError('Id não informado', 400))
    }

    const account = await this.accountsRepository.getByUserId(id)

    if (!account) {
      return left(new RequiredParametersError('Conta não encontrada', 400))
    }

    const transactions = await this.transactionsRepository.get(account.id, order, only)

    return right(transactions)
  }
}
