import { Controller, UseGuards }  from '@nestjs/common';
import { Get }                    from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator'
import { User }         from 'src/users/entities/user.entity';

import { DMService }  from '../services/dm.service';

@UseGuards(JwtAuthGuard)
@Controller('dm')
export class DMController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly dm_svc: DMService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Get('users')
	async findRelatedUsers(
		@AuthUser() user: User,
	)
		: Promise<User[]>
	{
		return this.dm_svc.findRelatedUsers(user);
	}

}
