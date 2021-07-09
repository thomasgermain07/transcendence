import { Controller, Body, Param, ParseIntPipe, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Get, Patch, Delete }      from '@nestjs/common';
import { UseGuards }               from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService }  from '../services/users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController
{
	// ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly users_svc: UsersService,
	)
	{

	}

	// ---------------------------------------------------------------------------
	// Public methods
	// ---------------------------------------------------------------------------
	@Get()
	async findAll()
		: Promise<User[]>
	{
		return this.users_svc.findAll();
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<User>
	{
		const target: User = await this.users_svc.findOne({
			id: id,
		});

		if (!target)
			throw new NotFoundException("User not found.");

		return target;
	}

	@Patch(':id')
	async update(
		@AuthUser() user: User,
		@Body() update_dto: UpdateUserDto,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<User>
	{
		const target: User = await this.users_svc.findOne({
			id: id
		});

		if (!target)
			throw new NotFoundException("User not found.");

		if (!await this.canModify(user, target))
			throw new ForbiddenException("You can not update this user.");

		return this.users_svc.update(target, update_dto);
	}

	@Delete(':id')
	async remove(
		@AuthUser() user: User,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<void>
	{
		const target: User = await this.users_svc.findOne({
			id: id
		});

		if (!target)
			throw new NotFoundException("User not found.");

		if (!await this.canModify(user, target))
			throw new ForbiddenException("You can not delete this user.");

		this.users_svc.remove(target);
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private async canModify(
		user: User,
		target: User,
	)
		: Promise<boolean>
	{
		// Todo:
		return (
			// user.isAdmin() ||
			user.id === target.id
		);
	}

}
