import { Controller } from '@nestjs/common'
import { Get, Post, Delete } from '@nestjs/common'
import { Body, Query, Param } from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/services/users.service'

import { CreateFriendshipDto } from '../dto/create-friendship.dto'
import { FriendshipsService } from '../services/friendships.service'
import { Friendship } from '../entities/friendship.entity'

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendshipsController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly friendships_svc: FriendshipsService,
		private readonly users_svc: UsersService,
	) {}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateFriendshipDto,
	)
		: Promise<Friendship>
	{
		const target: User = await this.users_svc.findOne({
			name: create_dto.target_name
		});

		if (!target)
			throw new NotFoundException("User not found.");

		if (user.id === target.id)
			throw new ForbiddenException("You can not be friend with yourself.");

		const friendship: Friendship = await this.friendships_svc.findOneOr(user, target);

		if (!friendship)
			return this.friendships_svc.create(user, target);

		if (friendship.user.id === user.id)
			return friendship;

		friendship.accepted = true;

		return this.friendships_svc.update(friendship);
	}

	@Get()
	async findAll(
		@AuthUser() user: User,
		@Query('pending') pending: boolean ,
	)
		: Promise<Friendship[]>
	{
		return this.friendships_svc.findAllOrWithAccepted(user, !pending);
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

		this.friendships_svc.remove(user, target);
	}

}
