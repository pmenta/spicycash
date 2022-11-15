import { describe, expect, it } from 'vitest'

import { TestAccountsRepository } from '@/repositories/testsRepositories/TestAccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { CashOutService } from '@/services/CashOut'
import { CreateUserService } from '@/services/User/CreateUserService'
import { TestTransactionsRepository } from '@/repositories/testsRepositories/TestTransactionsRepository'

describe('Get transactions service', async () => {
  const userRepository = new TestUsersRepository()
  const accountsRepository = new TestAccountsRepository(userRepository)
  const transactionsRepository = new TestTransactionsRepository(accountsRepository)

  const createUserService = new CreateUserService(userRepository)
  const cashOutService = new CashOutService(accountsRepository)

  const senderUser = await createUserService.execute({ username: 'Rick Sanchez', password: 'Senha123' })
  const receiverUser = await createUserService.execute({ username: 'Morty Sanchez', password: 'Senha123' })
  const thirdUser = await createUserService.execute({ username: 'Random Sanchez', password: 'Senha123' })

  if (senderUser.isLeft() || receiverUser.isLeft() || thirdUser.isLeft()) {
    throw new Error('Erro ao criar usuário')
  }

  await cashOutService.execute({ amount: 10, receiverUsername: receiverUser.value.username, userId: senderUser.value.id })
  await cashOutService.execute({ amount: 10, receiverUsername: senderUser.value.username, userId: receiverUser.value.id })
  await cashOutService.execute({ amount: 10, receiverUsername: thirdUser.value.username, userId: receiverUser.value.id })

  it('should be able to see all and only your transactions', async () => {
    const transactions = await transactionsRepository.get(senderUser.value.id)
    expect(transactions.length).toEqual(2)

    const thirdUserTransactions = await transactionsRepository.get(thirdUser.value.id)
    expect(thirdUserTransactions.length).toEqual(1)
  })
})
