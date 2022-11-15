import { Either, left, right } from '@/errors/either'
import { RequiredParametersError } from '@/errors/requiredParametersError'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { Prisma } from '@prisma/client'

interface ICashOutRequest {
  amount: number
  receiverUsername: string
  userId: string
}

type ICashOutResponse = boolean
export type IResponse = Either<RequiredParametersError, ICashOutResponse>

export class CashOutService {
  constructor (private readonly accountsRepository: AccountsRepository) {}

  async execute ({ amount, receiverUsername, userId }: ICashOutRequest): Promise<IResponse> {
    const account = await this.accountsRepository.getByUserId(userId)
    if (!account) {
      return left(new RequiredParametersError('Conta não encontrada', 400))
    }

    if (Number(account.balance) < amount) {
      return left(new RequiredParametersError('Saldo insuficiente', 400))
    }

    const cashInAccount = await this.accountsRepository.getByUsername(receiverUsername)
    if (!cashInAccount) {
      return left(new RequiredParametersError('O destinatário não existe', 400))
    }

    if (account.id === cashInAccount.id) {
      return left(new RequiredParametersError('Você não pode transferir para si mesmo', 400))
    }

    const newSenderBalance = new Prisma.Decimal(Number(account.balance) - amount)
    const newReceiverBalance = new Prisma.Decimal(Number(cashInAccount.balance) + amount)

    await this.accountsRepository.cashOut({ sender: account.id, receiver: cashInAccount.id, amount: new Prisma.Decimal(amount), senderBalance: newSenderBalance, receiverBalance: newReceiverBalance })

    return right(true)
  }
}
