import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PassportStrategy } from '@nestjs/passport';
import { stringify } from 'querystring';
import { Strategy } from 'passport-oauth2';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';

const CLIENT_ID = process.env.VITE_FT_ID;
const CLIENT_SECRET = process.env.VITE_FT_SECRET;
const CALLBACK_URL = process.env.VITE_FT_CALLBACK_URL;

@Injectable()
export class OAuthMarvinStrategy extends PassportStrategy(
	Strategy,
	'oauth-marvin',
) {
	constructor(
		private readonly http_svc: HttpService,
		private readonly auth_svc: AuthService,
		private readonly users_svc: UsersService,
	) {
		super({
			authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
				scope: 'public',
				response_type: 'code',
				client_id: CLIENT_ID,
				redirect_uri: CALLBACK_URL,
			})}`,
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			scope: 'public',
			clientID: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			callbackURL: CALLBACK_URL,
		});
	}

	async validate(access_token: string): Promise<User> {
		const { data } = await this.http_svc
			.get('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.toPromise();

		const user: User = await this.auth_svc.authenticate({
			marvin_id: data.id,
		});

		if (user) return user;

		const create_dto: CreateUserDto = {
			email: data.email,
			name: await this.getUniqueName(data.login),
			marvin_id: data.id,
			avatar: data.image_url,
		};

		return this.auth_svc.register(create_dto);
	}

	private async getUniqueName(login: string): Promise<string> {
		const found: User = await this.users_svc.findOne({ name: login });

		if (!found) return login;

		const last: User = await this.users_svc.findLastWithNameLike(login);

		return `${login}#${last?.id + 1}`;
	}
}
