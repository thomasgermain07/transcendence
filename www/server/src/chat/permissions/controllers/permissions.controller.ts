import { Controller, Body, UseGuards, Query, Param, ParseIntPipe } from '@nestjs/common';
import { Get, Post, Delete } from '@nestjs/common';
import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

import { AuthUser }             from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard }         from 'src/auth/guards/jwt-auth.guard';
import { User }                 from 'src/users/entities/user.entity';
import { UsersService }         from 'src/users/services/users.service';
import { Room }                 from 'src/chat/rooms/entities/room.entity';
import { RoomsService }         from 'src/chat/rooms/services/rooms.service';
import { ChatService }          from 'src/chat/services/chat.service';
import { SubscriptionsService } from 'src/chat/subscriptions/services/subscriptions.service';

import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission }          from '../entities/permission.entity';
import { PermissionType }      from "../entities/permission.entity";
import { PermissionsService }  from '../services/permissions.service';

@UseGuards(JwtAuthGuard)
@Controller('chat/permissions')
export class PermissionsController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly chat_svc: ChatService,
		private readonly users_svc: UsersService,
		private readonly rooms_svc: RoomsService,
		private readonly permissions_svc: PermissionsService,
		private readonly subscriptions_svc: SubscriptionsService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Get('filter')
	async get(
		@AuthUser() user: User,
		@Query('room_id', ParseIntPipe) room_id: number,
		@Query('type') type: string,
	)
		: Promise<Permission[]>
	{
		if (!this.isValidType(type))
			throw new ForbiddenException("Invalid permission type.");

		const room: Room = await this.rooms_svc.findOne({ id: room_id });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.chat_svc.isLeader(user, room) && !await this.chat_svc.isSubscribed(user, room))
			throw new ForbiddenException("You don't have access to this room.");

		return (await this.permissions_svc.find({ room: room, type: type }))
			.filter(permission => !permission.expired_at || permission.expired_at.getTime() >= Date.now());
	}

	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreatePermissionDto,
	)
		: Promise<Permission>
	{
		const target: User = await this.users_svc.findOne({
			id: create_dto.user_id
		});
		const room: Room = await this.rooms_svc.findOne({
			id: create_dto.room_id
		});

		if (!this.isValidType(create_dto.type))
			throw new UnprocessableEntityException("Invalid permission type.");

		if (!target || !room)
			throw new NotFoundException("Room or User not found.");

		if (!await this.chat_svc.isModerator(user, room))
			throw new ForbiddenException("You are not moderator for this room.");

		if (await this.chat_svc.isModerator(target, room) && !await this.chat_svc.isLeader(user, room))
			throw new ForbiddenException("You can not add role for other moderator.");

		if (create_dto.type == PermissionType.BANNED)
			this.subscriptions_svc.remove(target, room);

		return this.permissions_svc.create(target, room, create_dto);
	}

	@Delete()
	async remove(
		@AuthUser() user: User,
		@Query('room_id', ParseIntPipe) room_id: number,
		@Query('user_id', ParseIntPipe) target_id: number,
	)
		: Promise<void>
	{
		const target: User = await this.users_svc.findOne({
			id: target_id
		});
		const room: Room = await this.rooms_svc.findOne({
			id: room_id
		});

		if (!target || !room)
			throw new NotFoundException("Room or User not found.");

		if (!await this.chat_svc.isModerator(user, room))
			throw new ForbiddenException("You are not moderator for this room.");

		if (await this.chat_svc.isModerator(target, room) && !await this.chat_svc.isLeader(user, room))
			throw new ForbiddenException("You can not remove role for other moderator.");

		this.permissions_svc.remove(target, room);
	}

	private isValidType(
		type: string
	)
	{
		return (Object.values(PermissionType) as string[]).includes(type);
	}

}
