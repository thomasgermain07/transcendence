import { Injectable }            from "@nestjs/common";
import { ExecutionContext }      from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard }             from "@nestjs/passport";
import { Observable }            from "rxjs";

import { User } from "src/users/entities/user.entity";

@Injectable()
export class OAuthMarvinGuard
	extends AuthGuard('oauth-marvin')
{
	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	canActivate(
		context: ExecutionContext,
	)
		: boolean | Promise<boolean> | Observable<boolean>
	{
		return super.canActivate(context)
	}

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