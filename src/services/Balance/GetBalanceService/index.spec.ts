import { TestAccountsRepository } from '@/repositories/testsRepositories/TestAccountsRepository'
import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { AuthenticationService } from '@/services/Authentication'
import { CreateUserService } from '@/services/User/CreateUserService'
import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { GetBalanceService } from '.'

describe('Get balance service', () => {
  const userRepository = new TestUsersRepository()
  const accountsRepository = new TestAccountsRepository(userRepository)

  const createUserService = new CreateUserService(userRepository)
  const authenticationService = new AuthenticationService(userRepository)
  const getBalanceService = new GetBalanceService(accountsRepository)

  it('should be able to get balance', async () => {
    await createUserService.execute({ username: 'John Doe', password: 'Senha123' })
    const user = await authenticationService.execute({ username: 'John Doe', password: 'Senha123' })

    if (user.isRight()) {
      const balance = await getBalanceService.execute(user.value.token)

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
