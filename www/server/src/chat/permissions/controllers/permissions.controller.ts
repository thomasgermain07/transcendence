import { Controller, Body, UseGuards, Query, ParseIntPipe }    from '@nestjs/common';
import { Post, Delete }                          from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { AuthUser }     from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User }         from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Room }         from 'src/chat/rooms/entities/room.entity';
import { RoomsService } from 'src/chat/rooms/services/rooms.service';

import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission }          from '../entities/permission.entity';
import { PermissionsService }  from '../services/permissions.service';
import { ChatService } from 'src/chat/services/chat.service';

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
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
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

		if (!target || !room)
			throw new NotFoundException("Room or User not found.");

		if (!await this.chat_svc.isModerator(user, room))
			throw new ForbiddenException("You are not moderator for this room.");

		if (await this.chat_svc.isModerator(target, room) && !await this.chat_svc.isLeader(user, room))
			throw new ForbiddenException("You can not add role for other moderator.");

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

}
