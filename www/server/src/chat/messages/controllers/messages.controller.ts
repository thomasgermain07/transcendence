import { Controller, UseGuards } from '@nestjs/common';
import { Body, Query }           from '@nestjs/common';
import { Get, Post }             from '@nestjs/common';
import { ParseIntPipe }          from '@nestjs/common';
import { ForbiddenException }    from '@nestjs/common';
import { NotFoundException }     from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator'
import { User }         from 'src/users/entities/user.entity';
import { Room }         from 'src/chat/rooms/entities/room.entity';
import { RoomsService } from 'src/chat/rooms/services/rooms.service';
import { ChatService }  from 'src/chat/services/chat.service';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message }          from '../entities/message.entity';
import { MessagesService }  from '../services/messages.service';

@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class MessagesController
{

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly chat_svc: ChatService,
		private readonly rooms_svc: RoomsService,
		private readonly messages_svc: MessagesService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateMessageDto,
	)
		: Promise<Message>
	{
		const room: Room = await this.rooms_svc.findOne({ id: create_dto.room_id });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.canPost(user, room))
			throw new ForbiddenException("You can not post in this room.");

		return this.messages_svc.create(user, room, create_dto);
	}

	@Get()
	async findAll(
		@AuthUser() user: User,
		@Query('room_id', ParseIntPipe) room_id: number,
		@Query('page', ParseIntPipe) page: number,
	)
		: Promise<Message[]>
	{
		const room: Room = await this.rooms_svc.findOne({ id: room_id });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.canAccess(user, room))
			throw new ForbiddenException("You can not access to this room.");

		return this.messages_svc.findAll(room, page);
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private async canPost(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return (
			   await this.chat_svc.isLeader(user, room)
			|| (
				    await this.chat_svc.isSubscribed(user, room)
				&& !await this.chat_svc.isRestricted(user, room)
			)
		);
	}

	private async canAccess(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return (
			   await this.chat_svc.isLeader(user, room)
			|| await this.chat_svc.isSubscribed(user, room)
		);
	}

}
