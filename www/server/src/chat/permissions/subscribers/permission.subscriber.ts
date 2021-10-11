import { Injectable }                from '@nestjs/common';
import { Connection }   from 'typeorm';
import { InsertEvent, UpdateEvent, RemoveEvent }   from 'typeorm';
import { EntitySubscriberInterface } from 'typeorm';
import { EventSubscriber }           from 'typeorm';

import { ChatGateway } from 'src/chat/gateways/chat.gateway';

import { Permission } from '../entities/permission.entity';

@Injectable()
@EventSubscriber()
export class PermissionSubscriber
	implements EntitySubscriberInterface<Permission>
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
		: typeof Permission
	{
		return Permission;
	}

	afterInsert(
		event: InsertEvent<Permission>
	)
		: void
	{
		this.chat_gtw.setPermission(event.entity);
	}

	afterUpdate(
		event: UpdateEvent<Permission>
	)
		: void
	{
		this.chat_gtw.setPermission(event.databaseEntity);
	}

	afterRemove(
		event: RemoveEvent<Permission>
	)
		: void
	{
		this.chat_gtw.removePermission(event.databaseEntity);
	}

}
