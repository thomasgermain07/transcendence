import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
	handleRequest<User>(error: any, user: User): User {
		if (error || !user)
			throw new UnauthorizedException('Invalid JWT (Refresh) Token.');

		return user;
	}
}
