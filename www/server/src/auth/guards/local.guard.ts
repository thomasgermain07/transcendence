import { Injectable }            from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard }             from "@nestjs/passport";

@Injectable()
export class LocalGuard
	extends AuthGuard('local')
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
			throw new UnauthorizedException("Invalid Credentials.");

		return user;
	}

}
