import { Controller, UseGuards }        from "@nestjs/common";
import { Body, Query }                  from "@nestjs/common";
import { Post, Delete }                 from "@nestjs/common";
import { ParseIntPipe }                 from "@nestjs/common";
import { NotFoundException }            from "@nestjs/common";
import { ForbiddenException }           from "@nestjs/common";
import { UnprocessableEntityException } from "@nestjs/common";

import { JwtAuthGuard }       from 'src/auth/guards/jwt-auth.guard'
import { AuthUser }           from 'src/auth/decorators/auth-user.decorator'
import { User }               from 'src/users/entities/user.entity'
import { Room }               from 'src/chat/rooms/entities/room.entity'
import { RoomsService }       from 'src/chat/rooms/services/rooms.service'
import { ChatService }        from 'src/chat/services/chat.service'
import { PermissionType }     from 'src/chat/permissions/entities/permission.entity'
import { PermissionsService } from "src/chat/permissions/services/permissions.service";

import { CreateSubscriptionDto } from '../dto/create-subscription.dto'
import { SubscriptionsService }  from '../services/subscriptions.service'

@UseGuards(JwtAuthGuard)
@Controller('chat/subscriptions')
export class SubscriptionsController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly chat_svc: ChatService,
		private readonly rooms_svc: RoomsService,
		private readonly subscriptions_svc: SubscriptionsService,
		private readonly permissions_svc: PermissionsService,
	) {}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateSubscriptionDto,
	)
		: Promise<Room>
	{
		const room: Room = await this.rooms_svc.findOne({ name: create_dto.room_name });

		if (!room)
			throw new NotFoundException("Room not found.");

		if (await this.chat_svc.isOwner(user, room))
			throw new UnprocessableEntityException("You can not subscribe to your own room.")

		if (!user.is_admin && !(await this.rooms_svc.verifyPassword(room, create_dto.password)))
			throw new UnprocessableEntityException('Wrong password provided.')

		if (!user.is_admin && await this.chat_svc.hasPermission(user, room, PermissionType.BANNED))
			throw new ForbiddenException('You are banned from this room.')

		return (await this.subscriptions_svc.create(user, room)).room
	}

	@Delete()
	async remove(
		@AuthUser() user: User,
		@Query('room_id', ParseIntPipe) room_id: number,
	)
		: Promise<void>
	{
		const room: Room = await this.rooms_svc.findOne({ id: room_id });

		if (await this.chat_svc.isModerator(user, room))
			this.permissions_svc.remove(user, room);

		this.subscriptions_svc.remove(user, room)
	}
}
