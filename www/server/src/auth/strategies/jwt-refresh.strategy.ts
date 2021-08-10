import { Injectable }            from "@nestjs/common";
import { PassportStrategy }      from "@nestjs/passport";
import { Request }               from "express";
import { Strategy }              from "passport-jwt";
import { ExtractJwt }            from "passport-jwt";

import { User }         from "src/users/entities/user.entity";

import { AuthService }  from "../services/auth.service";
import { TokenPayload } from "../interfaces/token-payload.interface";

const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET;

@Injectable()
export class JwtRefreshStrategy
	extends PassportStrategy(Strategy, 'jwt-refresh')
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly auth_svc: AuthService
	)
	{
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request.cookies?.Refresh
				},
			]),
			secretOrKey: REFRESH_SECRET,
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
		return this.auth_svc.authenticate({
			id: payload.user_id,
			refresh_token: request.cookies?.Refresh,
		});
	}

}
