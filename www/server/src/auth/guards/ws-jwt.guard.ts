import { Injectable } from '@nestjs/common'
import { AuthGuard }  from '@nestjs/passport'
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard
	extends AuthGuard('ws-jwt')
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
			throw new WsException("Invalid WS Token.");

		return user;
	}

}
