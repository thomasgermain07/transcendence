import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'

import { User } from 'src/users/entities/user.entity'

import { AuthService } from '../services/auth.service'
import { TokenPayload } from '../interfaces/token-payload.interface'
import { UsersService } from 'src/users/services/users.service'

const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private readonly auth_svc: AuthService,
    private readonly userService: UsersService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.Authentication
        },
      ]),
      secretOrKey: ACCESS_SECRET,
    })
  }

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userService.findOne(payload.user_id);
    if (!user.isTwoFactorAuthenticationEnabled) {
      return this.auth_svc.authenticate({
        id: payload.user_id,
      })
    }

    if (payload.isSecondFactorAuthenticated) {
      return user;
    }
    return this.auth_svc.authenticate({
      id: payload.user_id,
    })
  }
}
