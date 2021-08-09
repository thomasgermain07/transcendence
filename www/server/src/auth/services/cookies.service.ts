import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "src/users/entities/user.entity";

import { TokenPayload } from "../interfaces/token-payload.interface";

export enum CookieType {
	AUTHENTICATION = 'Authentication',
	REFRESH        = 'Refresh',
};

@Injectable()
export class CookiesService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly jwt_svc: JwtService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	getJwtTokenCookie(
		user: User,
		type: CookieType,
	)
		: { token: string, cookie: string }
	{
		const secret = type === CookieType.AUTHENTICATION
			? process.env.JWT_ACCESS_SECRET
			: process.env.JWT_REFRESH_SECRET;
		const lifetime = type === CookieType.AUTHENTICATION
			? process.env.VITE_JWT_ACCESS_LIFETIME
			: process.env.VITE_JWT_REFRESH_LIFETIME;

		const payload: TokenPayload = { user_id: user.id };

		const token  = this.getJwtToken(payload, secret, lifetime);
		const cookie = this.getJwtCookie(type, token, lifetime);

		return { token: token, cookie: cookie };
	}

	getJwtClearCookies()
		: string[]
	{
		return [
			this.getJwtCookie(CookieType.AUTHENTICATION, '', '0'),
			this.getJwtCookie(CookieType.REFRESH, '', '0'),
		];
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private getJwtToken(
		payload: string | object,
		secret: string,
		lifetime: string,
	)
		: string
	{
		return this.jwt_svc.sign(payload, {
			secret: secret,
			expiresIn: `${lifetime}s`,
		});
	}

	private getJwtCookie(
		type: string,
		token: string,
		lifetime: string,
	)
		: string
	{
		return `${type}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${lifetime}`;
	}

}