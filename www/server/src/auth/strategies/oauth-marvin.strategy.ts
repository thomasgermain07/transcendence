import { Injectable }       from "@nestjs/common";
import { HttpService }      from "@nestjs/axios";
import { PassportStrategy } from "@nestjs/passport";
import { stringify }        from "querystring";
import { Strategy }         from "passport-oauth2";

import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User }          from "src/users/entities/user.entity";

import { AuthService } from "../services/auth.service";
import { UsersService } from "src/users/services/users.service";

const CLIENT_ID     = process.env.VITE_FT_ID;
const CLIENT_SECRET = process.env.VITE_FT_SECRET;
const CALLBACK_URL  = process.env.VITE_FT_CALLBACK_URL;

@Injectable()
export class OAuthMarvinStrategy
	extends PassportStrategy(Strategy, 'oauth-marvin')
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly http_svc: HttpService,
		private readonly auth_svc: AuthService,
		private readonly users_svc: UsersService,
	)
	{
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
		})
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async validate(
		access_token: string,
	)
		: Promise<User>
	{
		const { data } = await this.http_svc.get('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${access_token}`
			},
		})
		.toPromise();

		const user: User = await this.auth_svc.authenticate({
			marvin_id: data.id,
		});

		if (user)
			return user;

		const name_already_taken: boolean = !!(await this.users_svc.findOne({ name: data.login }));

		let username: string = data.login;
		if (name_already_taken)
		{
			const users: User[] = await this.users_svc.findAllWithNameLike(data.login);

			for (let i = 1; i < Number.MAX_SAFE_INTEGER; ++i)
			{
				username = `${data.login}_${i}`;

				if (!users.some(u => u.name === username))
					break;
			}
		}

		const create_dto: CreateUserDto = {
			email: data.email,
			name: username,
			marvin_id: data.id,
			avatar: data.image_url,
		};

		return this.auth_svc.register(create_dto);
	}

}
