import { Injectable }       from '@nestjs/common';

import { User }         from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class DMService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly users_svc: UsersService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async findRelatedUsers(
		user: User
	)
		: Promise<User[]>
	{
		return this.users_svc.findDMRelated(user);
	}

}
