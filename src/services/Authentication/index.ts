import { Either, left, right } from '@/errors/either'
import { RequiredParametersError } from '@/errors/requiredParametersError'
import { IUser, UsersRepository } from '@/repositories/UsersRepository'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface ILoginRequest {
  username: string
  password: string
}

type ILoginResponse = IUser & { token: string }
type IResponse = Either<RequiredParametersError, ILoginResponse>

class AuthenticationService {
  constructor (private readonly usersRepository: UsersRepository) {}
  async execute ({ username, password }: ILoginRequest): Promise<IResponse> {
    if (!username || !password) {
      return left(new RequiredParametersError('Nome e senha são obrigatórios', 400))
    }

    const user = await this.usersRepository.getByUsername(username)
    if (!user) {
      return left(new RequiredParametersError('Usuário não encontrado', 404))
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return left(new RequiredParametersError('Nome ou senha inválidos', 401))
    }

    const token = sign({ username }, process.env.SECRET as string, {
      subject: user.id,
      expiresIn: '1d'
    })

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      accountId: user.accountId
    }

    return right({ ...userWithoutPassword, token })
  }
}

export { AuthenticationService }
