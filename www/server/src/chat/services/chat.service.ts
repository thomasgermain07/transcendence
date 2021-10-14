import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

import { Room }                 from '../rooms/entities/room.entity';
import { RoomsService }         from '../rooms/services/rooms.service';
import { Permission }           from '../permissions/entities/permission.entity';
import { PermissionType }       from '../permissions/entities/permission.entity';
import { PermissionsService }   from '../permissions/services/permissions.service';
import { Subscription }         from '../subscriptions/entities/subscription.entity';
import { SubscriptionsService } from '../subscriptions/services/subscriptions.service';

@Injectable()
export class ChatService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly rooms_svc: RoomsService,
		private readonly permissions_svc: PermissionsService,
		private readonly subscriptions_svc: SubscriptionsService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async getRelatedRooms(
		user: User,
	)
		: Promise<Room[]>
	{
		const subscriptions: Subscription[] = await this.subscriptions_svc.find({
			user: user,
		});
		const subscribed: Room[] = subscriptions.map((sub) => sub.room);

		const owned: Room[] = await this.rooms_svc.find({
			owner: user,
		});

		return owned.concat(subscribed);
	}

	async getSubscribers(
		room: Room,
	)
		: Promise<User[]>
	{
		const subscriptions: Subscription[] = await this.subscriptions_svc.find({
			room: room,
		});

		return subscriptions
			.map((subscription) => subscription.user)
			// Todo:
			// .filter((user) => !user.is_admin)
		;
	}

	async hasPermission(
		user: User,
		room: Room,
		permission_type: PermissionType,
	)
		: Promise<boolean>
	{
		const permission: Permission = await this.permissions_svc.findOne({
			user: user,
			room: room,
			type: permission_type
		});

		return permission && (
			  !permission.expired_at
			|| permission.expired_at.getTime() >= Date.now()
		);
	}

	async isOwner(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return room.owner.id === user.id;
	}

	async isLeader(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		// Todo:
		return (/* user.is_admin ||  */await this.isOwner(user, room));
	}

	async isModerator(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return (
			   await this.isLeader(user, room)
			|| await this.hasPermission(user, room, PermissionType.MODERATOR)
		);
	}

	async isRestricted(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		return (
			   await this.hasPermission(user, room, PermissionType.BANNED)
			|| await this.hasPermission(user, room, PermissionType.MUTED)
		);
	}

	async isSubscribed(
		user: User,
		room: Room,
	)
		: Promise<boolean>
	{
		const subscription: Subscription = await this.subscriptions_svc.findOne({
			user: user,
			room: room,
		});

		return !!subscription;
	}

}
