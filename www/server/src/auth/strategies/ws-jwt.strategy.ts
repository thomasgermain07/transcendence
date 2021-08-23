import { Injectable }            from '@nestjs/common'
import { UnauthorizedException } from '@nestjs/common'
import { PassportStrategy }      from '@nestjs/passport'
import { Request }               from 'express'
import { ExtractJwt }            from 'passport-jwt'
import { Strategy }              from 'passport-jwt'

import { User } from 'src/users/entities/user.entity'

import { AuthService }  from '../services/auth.service'
import { TokenPayload } from '../interfaces/token-payload.interface'

@Injectable()
export class WsJwtStrategy
	extends PassportStrategy(Strategy, 'ws-jwt')
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly auth_svc: AuthService,
	)
	{
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request.cookies?.Authentication
				},
			]),
			secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
		})
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		payload: TokenPayload,
	)
		: Promise<User>
	{
		const user: User = await this.auth_svc.authenticate({
			id: payload.user_id
		});

		if (!user)
			throw new UnauthorizedException("Invalid User ID.");

		return user;
	}

}
