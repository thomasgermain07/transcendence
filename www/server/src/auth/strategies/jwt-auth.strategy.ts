import { Injectable, UnauthorizedException }           from '@nestjs/common'
import { PassportStrategy }     from '@nestjs/passport'
import { Request }              from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User }         from 'src/users/entities/user.entity'

import { AuthService }  from '../services/auth.service'
import { TokenPayload } from '../interfaces/token-payload.interface'

@Injectable()
export class JwtStrategy
	extends PassportStrategy(Strategy)
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly authService: AuthService,
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
		const user: User = await this.authService.authenticate({
			id: payload.user_id
		});

		if (!user)
			throw new UnauthorizedException("Invalid User ID.");

		return user;
	}

}
