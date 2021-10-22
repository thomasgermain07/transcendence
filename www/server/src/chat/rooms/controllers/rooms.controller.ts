import { Controller, NotFoundException, ParseIntPipe, UseGuards }    from '@nestjs/common';
import { Body, Param, Query }       from '@nestjs/common';
import { Get, Post, Patch, Delete } from '@nestjs/common';
import { ForbiddenException }       from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator';
import { User }         from 'src/users/entities/user.entity';
import { ChatService }  from 'src/chat/services/chat.service'

import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { RoomsService }  from '../services/rooms.service';
import { Room }          from '../entities/room.entity';

@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class RoomsController
{
	constructor(
		private readonly rooms_svc: RoomsService,
		private readonly chat_svc: ChatService,
	)
	{

	}

	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateRoomDto,
	)
		: Promise<Room>
	{
		return this.rooms_svc.create(user, create_dto);
	}

	@Get()
	async findAll(
		@AuthUser() user: User,
		@Query('related') related: boolean,
	)
		: Promise<Room[]>
	{
		const rooms: Room[] = await this.chat_svc.getRelatedRooms(user);

		if (related)
			return rooms;

		return this.rooms_svc.findVisibleNotIn(rooms);
	}

	@Get(':id')
	async findOne(
		@AuthUser() user: User,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<Room>
	{
		const room: Room = await this.rooms_svc.findOne({ id: id });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.canAccess(user, room))
			throw new ForbiddenException("You can not access this room.");

		return room;
	}

	@Patch(':id')
	async update(
		@AuthUser() user: User,
		@Body() update_dto: UpdateRoomDto,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<Room>
	{
		const room: Room = await this.rooms_svc.findOne({
			id: id
		});

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.canModify(user, room))
			throw new ForbiddenException("You can not modify this room.");

		return this.rooms_svc.update(room, update_dto);
	}

	@Delete(':id')
	async remove(
		@AuthUser() user: User,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<void>
	{
		const room: Room = await this.rooms_svc.findOne({ id: id });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (!await this.canModify(user, room))
			throw new ForbiddenException("You can not delete this room.");

		this.rooms_svc.remove(room);
	}

	private async canAccess(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return (
			   room.visible
			|| await this.chat_svc.isSubscribed(user, room)
			|| await this.canModify(user, room)
		);
	}

	private async canModify(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return this.chat_svc.isLeader(user, room);
	}

}
