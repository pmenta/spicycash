import { ICreateUserRequest, UsersRepository, IUser } from '@/repositories/UsersRepository'
import { randomUUID } from 'node:crypto'
import { Account, Prisma } from '@prisma/client'

export class TestUsersRepository implements UsersRepository {
  public users: IUser[] = []
  public accounts: Account[] = []

  async create (data: ICreateUserRequest): Promise<IUser> {
    const user = {
      id: randomUUID(),
      username: data.username,
      accountId: randomUUID(),
      password: data.password
    }

    this.users.push(user)
    this.accounts.push({ id: user.accountId, balance: new Prisma.Decimal(100) })

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      accountId: user.accountId
    }

    return userWithoutPassword
  }

  async getByUsername (username: string): Promise<IUser & { password: string } | null> {
    const user = this.users.find(user => user.username === username) as IUser & { password: string }

    return user ?? null
  }
}
