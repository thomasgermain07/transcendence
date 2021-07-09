import { Injectable, UnauthorizedException }       from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy }         from 'passport-local';

import { User } from 'src/users/entities/user.entity'

import { AuthService } from '../services/auth.service'

@Injectable()
export class LocalStrategy
	extends PassportStrategy(Strategy)
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private auth_svc: AuthService,
	)
	{
		super({ usernameField: 'email' });
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		email: string,
		password: string,
	)
		: Promise<User>
	{
		const user: User = await this.auth_svc.authenticate({
			email: email,
			password: password,
		});

		if (!user)
			throw new UnauthorizedException("Invalid credentials.");

		return user;
	}

}