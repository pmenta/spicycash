import { describe, it, expect } from 'vitest'

import { TestUsersRepository } from '@/repositories/testsRepositories/TestUserRepository'
import { CreateUserService } from '@/services/User/CreateUserService'
import { AuthenticationService } from '@/services/Authentication'

describe('Authentication service', () => {
  it('should be able to auth', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)
    const authenticationService = new AuthenticationService(testUserRepository)

    await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    const auth = await authenticationService.execute({ username: 'John Doe', password: 'Senha123' })

    expect(auth.value).toHaveProperty('token')
    expect(auth.value).toHaveProperty('id')
    expect(auth.value).toHaveProperty('username')
    expect(auth.value).not.toHaveProperty('password')
  })

  it('should not be able to login with an incorrect password', async () => {
    const testUserRepository = new TestUsersRepository()
    const createUserService = new CreateUserService(testUserRepository)
    const authenticationService = new AuthenticationService(testUserRepository)

    await createUserService.execute({
      username: 'John Doe',
      password: 'Senha123'
    })

    const auth = await authenticationService.execute({ username: 'John Doe', password: '123456' })

    expect(auth.isLeft()).toBeTruthy()
    if (auth.isLeft()) {
      expect(auth.value).toBeInstanceOf(Error)
      expect(auth.value._message).toEqual('Nome ou senha inválidos')
    }
  })

  it('should show that user not exists if not exists', async () => {
    const testUserRepository = new TestUsersRepository()
    const authenticationService = new AuthenticationService(testUserRepository)

    const auth = await authenticationService.execute({ username: 'John Doe', password: '123456' })

    expect(auth.isLeft()).toBeTruthy()
    if (auth.isLeft()) {
      expect(auth.value).toBeInstanceOf(Error)
      expect(auth.value._message).toEqual('Usuário não encontrado')
    }
  })

  it('should throw error if username or password was not gave', async () => {
    const testUserRepository = new TestUsersRepository()
    const authenticationService = new AuthenticationService(testUserRepository)

    const auth = await authenticationService.execute({ username: null as unknown as string, password: '123456' })
    expect(auth.isLeft()).toBeTruthy()
    if (auth.isLeft()) {
      expect(auth.value).toBeInstanceOf(Error)
      expect(auth.value._message).toEqual('Nome e senha são obrigatórios')
    }

    const auth2 = await authenticationService.execute({ username: 'John Doe', password: null as unknown as string })
    expect(auth2.isLeft()).toBeTruthy()
    if (auth2.isLeft()) {
      expect(auth2.value).toBeInstanceOf(Error)
      expect(auth2.value._message).toEqual('Nome e senha são obrigatórios')
    }
  })
})
