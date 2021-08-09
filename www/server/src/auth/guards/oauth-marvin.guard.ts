import { Injectable }            from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard }             from "@nestjs/passport";

@Injectable()
export class OAuthMarvinGuard
	extends AuthGuard('oauth-marvin')
{
	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	handleRequest<User>(
		error: any,
		user: User,
	)
		: User
	{
		if (error || !user)
			throw new UnauthorizedException("OAuth-marvin guard failed.");

		return user;
	}

}