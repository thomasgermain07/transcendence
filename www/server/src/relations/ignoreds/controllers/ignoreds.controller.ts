import { Controller, Body, Param } from '@nestjs/common'
import { Get, Post, Delete } from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/services/users.service'

import { CreateIgnoredDto } from '../dto/create-ignored.dto'
import { IgnoredsService } from '../services/ignoreds.service'
import { Ignored } from '../entities/ignored.entity'

@UseGuards(JwtAuthGuard)
@Controller('ignoreds')
export class IgnoredsController
{
	constructor(
		private readonly ignoreds_svc: IgnoredsService,
		private readonly users_svc: UsersService,
	) {}

	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateIgnoredDto,
	)
		: Promise<Ignored>
	{
		const target: User = await this.users_svc.findOne({
			id: create_dto.target_id
		});

		if (!target)
			throw new NotFoundException("User not found.");

		if (user.id === target.id)
			throw new ForbiddenException("You can not ignore yourself.");

		return this.ignoreds_svc.create(user, target);
	}

	@Get()
	async findAll(
		@AuthUser() user: User,
	)
		: Promise<Ignored[]>
	{
		return this.ignoreds_svc.findAll(user);
	}

	@Delete(':id')
	async remove(
		@AuthUser() user: User,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<void>
	{
		const target: User = await this.users_svc.findOne({
			id: id,
		});

		if (!target)
			throw new NotFoundException('User not found.');

		this.ignoreds_svc.remove(user, target);
	}

}
