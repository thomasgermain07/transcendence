import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from '../users/users.service'
import TokenPayload from './token-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    })
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getById(payload.userId)
  }
}
