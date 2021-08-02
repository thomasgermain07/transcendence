import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message }          from '../entities/message.entity'

@Injectable()
export class MessagesService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(Message)
		private readonly message_repo: Repository<Message>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	create(
		author: User,
		target: User,
		create_dto: CreateMessageDto
	)
		: Promise<Message>
	{
		const message: Message = this.message_repo.create();
		message.author = author;
		message.target = target;
		message.content = create_dto.content;

		return this.message_repo.save(message);
	}

}
