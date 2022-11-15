import { Either, left, right } from '@/errors/either'
import { RequiredParametersError } from '@/errors/requiredParametersError'
import { ICreateUserRequest, IUser, UsersRepository } from '@/repositories/UsersRepository'

import { hash } from 'bcryptjs'

type ICreateUserResponse = IUser
export type IResponse = Either<RequiredParametersError, ICreateUserResponse>

export class CreateUserService {
  constructor (
    private readonly usersRepository: UsersRepository
  ) {}

  async execute ({ username, password }: ICreateUserRequest): Promise<IResponse> {
    if (!username || !password) {
      return left(new RequiredParametersError('O nome e a senha são obrigatórios', 400))
    }

    if (username.length < 3) {
      return left(new RequiredParametersError('O nome deve ter no mínimo 3 caracteres', 400))
    }

    const passwordValidator = /^(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordValidator.test(password)) {
      return left(new RequiredParametersError('A senha deve ter no mínimo 8 caracteres e uma letra maiúscula', 400))
    }

    const userAlreadyExists = await this.usersRepository.getByUsername(username)
    if (userAlreadyExists) {
      return left(new RequiredParametersError('Já existe um usuário com esse nome', 403))
    }

    const hashPassword = await hash(password, 10)

    const user = await this.usersRepository.create({ username, password: hashPassword })

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      accountId: user.accountId
    }

    return right(userWithoutPassword)
  }
}
