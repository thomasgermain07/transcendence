import { Injectable } from '@nestjs/common';
import { Connection, InsertEvent } from 'typeorm';
import { EntitySubscriberInterface } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { DMGateway } from 'src/direct_message/gateways/dm.gateway';

import { Message } from '../entities/message.entity';

@Injectable()
@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
	constructor(
		private readonly connection: Connection,
		private readonly dm_gtw: DMGateway,
	) {
		connection.subscribers.push(this);
	}

	listenTo(): typeof Message {
		return Message;
	}

	afterInsert(event: InsertEvent<Message>): void {
		this.dm_gtw.sendMessage(event.entity);
	}
}
