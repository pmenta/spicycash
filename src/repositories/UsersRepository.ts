export interface IUser {
  id: string
  username: string
  accountId: string
}

export interface ICreateUserRequest {
  username: string
  password: string
}

export interface UsersRepository {
  create: (data: ICreateUserRequest) => Promise<IUser>
  getByUsername: (username: string) => Promise<IUser | null>
}
