import { Injectable }            from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard }             from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard
	extends AuthGuard('jwt-auth')
{
	handleRequest<User>(
		error: any,
		user: User,
	)
		: User
	{
		if (error || !user)
			throw new UnauthorizedException("Invalid JWT Token.");

		return user;
	}

}
