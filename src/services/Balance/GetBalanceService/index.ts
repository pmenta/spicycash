import { Prisma } from '@prisma/client'

import { AccountsRepository } from '@/repositories/AccountsRepository'
import { Either, left, right } from '@/errors/either'
import { RequiredParametersError } from '@/errors/requiredParametersError'

interface IGetBalanceResponse { balance: Prisma.Decimal }
export type IResponse = Either<RequiredParametersError, IGetBalanceResponse>

export class GetBalanceService {
  constructor (private readonly accountRepository: AccountsRepository) {}
  async execute (userId: string): Promise<IResponse> {
    const account = await this.accountRepository.getByUserId(userId)

    if (!account) {
      return left(new RequiredParametersError('Conta não encontrada', 400))
    }

    return right({ balance: account.balance })
  }
}
