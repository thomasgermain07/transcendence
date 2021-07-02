import { Controller, Get, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

import { UsersService } from '../services/users.service'

@Controller('users')
export class UsersController
{
	// ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly usersService : UsersService
	)
	{

	}

	// ---------------------------------------------------------------------------
	// Public methods
	// ---------------------------------------------------------------------------
	@UseGuards(JwtAuthGuard)
	@Get()
	getAll()
		: string
	{
		return 'All Users'
	}

}
