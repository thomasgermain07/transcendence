import { Controller, Body, UseGuards }  from '@nestjs/common';
import { Post }                         from '@nestjs/common';
import { NotFoundException }            from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator'
import { User }         from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message }          from '../entities/message.entity';
import { MessagesService }  from '../services/messages.service';

@UseGuards(JwtAuthGuard)
@Controller('dm/messages')
export class MessagesController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly users_svc: UsersService,
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
		const target: User = await this.users_svc.findOne({
			id: create_dto.target_id
		});

		if (!target)
			throw new NotFoundException("Target not found.");

		return this.messages_svc.create(user, target, create_dto);
	}

}
