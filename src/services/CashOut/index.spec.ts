import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'

import { TestAccountsRepository } from '@/repositories/testsRepositories/TestAccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { CashOutService } from '.'
import { GetBalanceService } from '@/services/Balance/GetBalanceService'
import { CreateUserService } from '@/services/User/CreateUserService'

describe('CashOut Service', async () => {
  const userRepository = new TestUsersRepository()
  const accountsRepository = new TestAccountsRepository(userRepository)

  const createUserService = new CreateUserService(userRepository)
  const getBalanceService = new GetBalanceService(accountsRepository)
  const cashOutService = new CashOutService(accountsRepository)

  const senderUser = await createUserService.execute({ username: 'John Doe', password: 'Senha123' })
  const receiverUser = await createUserService.execute({ username: 'Tom Doe', password: 'Senha123' })

  if (senderUser.isLeft() || receiverUser.isLeft()) {
    throw new Error('Erro ao criar usuário')
  }

  it('should be able to cash out', async () => {
    const cashOut = await cashOutService.execute({ amount: 10, receiverUsername: receiverUser.value.username, userId: senderUser.value.id })
    expect(cashOut.isRight()).toBeTruthy()

    const senderBalance = await getBalanceService.execute(senderUser.value.id)
    const receiverBalance = await getBalanceService.execute(receiverUser.value.id)

    if (senderBalance.isLeft() || receiverBalance.isLeft()) {
      throw new Error('Erro ao buscar saldo')
    }

    expect(senderBalance.value.balance).toEqual(new Prisma.Decimal(90))
    expect(receiverBalance.value.balance).toEqual(new Prisma.Decimal(110))
  })

  it('should not be able to cashout to yourself', async () => {
    const cashOut = await cashOutService.execute({ amount: 10, receiverUsername: senderUser.value.username, userId: senderUser.value.id })
    expect(cashOut.isLeft()).toBeTruthy()
    if (cashOut.isLeft()) {
      expect(cashOut.value._message).toEqual('Você não pode transferir para si mesmo')
    }
  })

  it('should not be able to cashout with insufficient funds', async () => {
    const cashOut = await cashOutService.execute({ amount: 1000, receiverUsername: receiverUser.value.username, userId: senderUser.value.id })

    expect(cashOut.isLeft()).toBeTruthy()
    if (cashOut.isLeft()) {
      expect(cashOut.value._message).toEqual('Saldo insuficiente')
    }
  })

  it('should not be able to cashout if sender does not exists', async () => {
    const cashOut = await cashOutService.execute({ amount: 10, receiverUsername: receiverUser.value.username, userId: '123' })

    expect(cashOut.isLeft()).toBeTruthy()
    if (cashOut.isLeft()) {
      expect(cashOut.value._message).toEqual('Conta não encontrada')
    }
  })

  it('should not be able to cashout if receiver does not exists', async () => {
    const cashOut = await cashOutService.execute({ amount: 10, receiverUsername: 'zeninguem', userId: senderUser.value.id })

    expect(cashOut.isLeft()).toBeTruthy()
    if (cashOut.isLeft()) {
      expect(cashOut.value._message).toEqual('O destinatário não existe')
    }
  })

  it('every cashout should be registered in transactions', async () => {
    const cashOut = await cashOutService.execute({ amount: 2, receiverUsername: receiverUser.value.username, userId: senderUser.value.id })
    expect(cashOut.isRight()).toBeTruthy()

    expect(accountsRepository.transactions.length).toEqual(2)
  })
})
