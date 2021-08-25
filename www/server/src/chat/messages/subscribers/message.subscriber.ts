import { Injectable }                from '@nestjs/common';
import { Connection, InsertEvent }   from 'typeorm';
import { EntitySubscriberInterface } from 'typeorm';
import { EventSubscriber }           from 'typeorm';

import { ChatGateway } from 'src/chat/gateways/chat.gateway';

import { Message } from '../entities/message.entity';

@Injectable()
@EventSubscriber()
export class MessageSubscriber
	implements EntitySubscriberInterface<Message>
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly connection: Connection,
		private readonly chat_gtw: ChatGateway,
	)
	{
		connection.subscribers.push(this);
	}

	// -------------------------------------------------------------------------
	// Interfaces Implementations
	// -------------------------------------------------------------------------
	listenTo()
		: typeof Message
	{
		return Message;
	}

	afterInsert(
		event: InsertEvent<Message>
	)
		: void
	{
		this.chat_gtw.sendMessage(event.entity);
	}

}
