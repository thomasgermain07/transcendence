import { Controller, UseGuards } from '@nestjs/common';
import { Body, Query }           from '@nestjs/common';
import { Get, Post }             from '@nestjs/common';
import { ParseIntPipe }          from '@nestjs/common';
import { NotFoundException }     from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator'
import { User }         from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Ignored }     from 'src/relations/ignoreds/entities/ignored.entity';
import { IgnoredsService } from 'src/relations/ignoreds/services/ignoreds.service';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message }          from '../entities/message.entity';
import { MessagesService }  from '../services/messages.service';

@UseGuards(JwtAuthGuard)
@Controller('dm/messages')
export class MessagesController
{
	constructor(
		private readonly users_svc: UsersService,
		private readonly ignoreds_svc: IgnoredsService,
		private readonly messages_svc: MessagesService,
	)
	{

	}

	@Post()
	async create(
		@AuthUser() user: User,
		@Body() create_dto: CreateMessageDto,
	)
		: Promise<Message>
	{
		const target: User = await this.users_svc.findOne({
			id: create_dto.target_id
		});

		if (!target)
			throw new NotFoundException("Target not found.");

		const ignored: Ignored = await this.ignoreds_svc.findOrReverse(user, target);

		if (ignored)
			throw new UnprocessableEntityException("Cannot send DM to a user you are ignoring or who is ignoring you.");

		return this.messages_svc.create(user, target, create_dto);
	}

	@Get()
	async findAll(
		@AuthUser() user: User,
		@Query('target', ParseIntPipe) target_id: number,
		@Query('page', ParseIntPipe) page: number,
	)
		: Promise<Message[]>
	{
		const target: User = await this.users_svc.findOne({
			id: target_id
		});

		if (!target)
			throw new NotFoundException("Target not found.");

		return this.messages_svc.findAll(user, target, page);
	}

}
