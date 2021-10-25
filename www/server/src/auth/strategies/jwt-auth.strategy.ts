import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET;

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
	constructor(private readonly auth_svc: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request.cookies?.Authentication;
				},
			]),
			secretOrKey: ACCESS_SECRET,
		});
	}

	async validate(payload: TokenPayload): Promise<User> {
		return this.auth_svc.authenticate({
			id: payload.user_id,
		});
	}
}
