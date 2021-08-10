import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/services/users.service'

import { AuthenticationPayload } from '../interfaces/authentication-payload.interface'

@Injectable()
export class AuthService {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private readonly users_svc: UsersService) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async register(create_dto: CreateUserDto): Promise<User> {
    if (create_dto.password)
      create_dto.password = await this.hashSecure(create_dto.password)

    return this.users_svc.create(create_dto)
  }

  // Todo: Verify empty args (password / token)
  async authenticate(data: AuthenticationPayload): Promise<User> {
    const credentials = {}
    data.id ? (credentials['id'] = data.id) : null
    data.email ? (credentials['email'] = data.email) : null
    data.marvin_id ? (credentials['marvin_id'] = data.marvin_id) : null

    const user: User = await this.users_svc.findOne(credentials)

    if (!user) return undefined

    if (data.password && !(await this.hashVerify(data.password, user.password)))
      return undefined

    if (
      data.refresh_token &&
      !(await this.hashVerify(data.refresh_token, user.refresh_token))
    )
      return undefined

    return user
  }

  async refresh(user: User, token: string): Promise<void> {
    await this.users_svc.setRefreshToken(user, await this.hashSecure(token))
  }

  async logout(user: User): Promise<void> {
    return this.users_svc.setRefreshToken(user, null)
  }

  // -------------------------------------------------------------------------
  // Private methods
  // -------------------------------------------------------------------------
  private async hashSecure(data: string): Promise<string> {
    return bcrypt.hash(data, 10)
  }

  private async hashVerify(
    data: string,
    hashed_data: string,
  ): Promise<boolean> {
    if (!data || !hashed_data) return false

    return bcrypt.compare(data, hashed_data)
  }
}
