import { ICreateUserRequest, UsersRepository, IUser } from '@/repositories/UsersRepository'
import { prismaClient } from '@/database/prismaClient'

export class PrismaUsersRepository implements UsersRepository {
  async create (data: ICreateUserRequest): Promise<IUser> {
    const user = await prismaClient.user.create({
      data: {
        username: data.username,
        password: data.password,
        account: {
          create: { }
        }
      }
    })

    return user
  }

  async getByUsername (username: string): Promise<IUser | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        username
      }
    })

    return user
  }
}
