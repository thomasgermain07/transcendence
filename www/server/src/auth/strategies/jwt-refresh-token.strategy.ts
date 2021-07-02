import { Injectable }           from '@nestjs/common'
import { PassportStrategy }     from '@nestjs/passport'
import { Request }              from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User }         from 'src/users/entities/user.entity'

import { AuthService }  from '../services/auth.service'
import { TokenPayload } from '../interfaces/token-payload.interface'

@Injectable()
export class JwtRefreshTokenStrategy
	extends PassportStrategy(Strategy, 'jwt-refresh-token')
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly authService: AuthService
	)
	{
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request.cookies?.Refresh
				},
			]),
			secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		})
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		request: Request,
		payload: TokenPayload
	)
		: Promise<User>
	{
		return this.authService.authenticateByRefreshToken(
			payload.user_id,
			request.cookies?.Refresh,
		)
	}

}
