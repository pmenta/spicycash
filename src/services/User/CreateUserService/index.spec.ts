import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { Prisma } from '@prisma/client'
import { describe, it, expect } from 'vitest'
import { CreateUserService } from '.'

describe('Create user service', () => {
  it('should be able to create an user', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    const user = await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    expect(user.isRight()).toBe(true)
    expect(user.value).toHaveProperty('id')
    expect(user.value).toHaveProperty('username')
    expect(user.value).not.toHaveProperty('password')

    expect(testUserRepository.users.length).toBe(1)
  })

  it('should not be able to create an user with not unique username', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    const user = await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toHaveProperty('message', 'Já existe um usuário com esse nome')
  })

  it('should create an account to a new user with a balance of 100$', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    const user = await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    expect(user.isRight()).toBe(true)

    if (user.isRight()) {
      expect(testUserRepository.accounts.find(account => account.id === user.value.accountId)).toHaveProperty('balance', new Prisma.Decimal(100))
    }
  })

  it('should not be able to create an user with a username with less than 3 characters', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    const user = await createUserService.execute({
      username: 'Jo',
      password: 'Senha123'
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toHaveProperty('message', 'O nome deve ter no mínimo 3 caracteres')
  })

  it('should not be able to create an user with a password with less than 8 characters and 1 uppercase', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    const user = await createUserService.execute({
      username: 'John Doe',
      password: 'senha123'
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toHaveProperty('message', 'A senha deve ter no mínimo 8 caracteres e uma letra maiúscula')

    const user2 = await createUserService.execute({
      username: 'John Doe',
      password: 'Senha'
    })

    expect(user2.isLeft()).toBe(true)
    expect(user2.value).toHaveProperty('message', 'A senha deve ter no mínimo 8 caracteres e uma letra maiúscula')
  })

  it('should not be able to create an user without username and password', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)

    const user = await createUserService.execute({
      username: 'John Doe',
      password: null as unknown as string
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toHaveProperty('message', 'O nome e a senha são obrigatórios')

    const user2 = await createUserService.execute({
      username: null as unknown as string,
      password: 'Senha123'
    })

    expect(user2.isLeft()).toBe(true)
    expect(user2.value).toHaveProperty('message', 'O nome e a senha são obrigatórios')
  })
})
