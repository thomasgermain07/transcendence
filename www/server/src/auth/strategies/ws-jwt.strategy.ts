import { Injectable }            from '@nestjs/common'
import { PassportStrategy }      from '@nestjs/passport'
import { ExtractJwt }            from 'passport-jwt'
import { Strategy }              from 'passport-jwt'

import { User } from 'src/users/entities/user.entity'

import { AuthService }  from '../services/auth.service'
import { TokenPayload } from '../interfaces/token-payload.interface'

const tokenizeCookies = (str: string): any => {
	let cookieObject = {} ;
	if (str) {
		const strToArray = str.split(';').map(str => str.replace(/\s/g, ''));
		strToArray.forEach(el => {
			const tmp = el.split("=")
			cookieObject[tmp[0]] = tmp[1];
		});
	}
	return cookieObject
}

const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET

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
				(request: any) => {
					console.log('IN WS AUTH STRAT')
					const cookies: any = tokenizeCookies(request.handshake.headers.cookie)
					console.log('Auth cookie: ' + cookies.Authentication)
					return cookies.Authentication
				},
			]),
			secretOrKey: ACCESS_SECRET,
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
		return this.auth_svc.authenticate({
			id: payload.user_id
		});
	}

}
