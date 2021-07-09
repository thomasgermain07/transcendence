import { Injectable }       from '@nestjs/common';
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
		private authService: AuthService
	)
	{
		super({ usernameField: 'email' });
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		email: string,
		password: string
	)
		: Promise<User>
	{
		return this.authService.authenticateByCredentials(email, password);
	}

}