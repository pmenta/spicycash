import { TestAccountsRepository } from '@/repositories/testsRepositories/TestAccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { CreateUserService } from '@/services/User/CreateUserService'
import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { GetBalanceService } from '.'

describe('Get balance service', () => {
  const userRepository = new TestUsersRepository()
  const accountsRepository = new TestAccountsRepository(userRepository)

  const createUserService = new CreateUserService(userRepository)
  const getBalanceService = new GetBalanceService(accountsRepository)

  it('should be able to get balance', async () => {
    const user = await createUserService.execute({ username: 'John Doe', password: 'Senha123' })

    expect(user.isRight()).toBeTruthy()
    if (user.isRight()) {
      const balance = await getBalanceService.execute(user.value.id)

      expect(balance.isRight()).toBeTruthy()
      if (balance.isRight()) {
        expect(balance.value).toHaveProperty('balance')
        expect(balance.value.balance).toEqual(new Prisma.Decimal(100))
      }
    }
  })

  it('should not be able to get balance if user not exists', async () => {
    const balance = await getBalanceService.execute('token')
    if (balance.isLeft()) {
      expect(balance.value._message).toEqual('Conta não encontrada')
    }
  })
})
