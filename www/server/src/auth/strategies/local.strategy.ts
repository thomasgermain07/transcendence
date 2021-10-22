import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly auth_svc: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
			session: false,
		});
	}

	async validate(email: string, password: string): Promise<User> {
		return this.auth_svc.authenticate({
			email: email,
			password: password,
		});
	}
}
