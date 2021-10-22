import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/chat/rooms/entities/room.entity';

import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
	constructor(
		@InjectRepository(Subscription)
		private readonly subscription_repo: Repository<Subscription>,
	) {}

	async create(user: User, room: Room): Promise<Subscription> {
		const subscription: Subscription = this.subscription_repo.create();
		subscription.user = user;
		subscription.room = room;

		return this.subscription_repo.save(subscription);
	}

	async find(data: Object): Promise<Subscription[]> {
		return this.subscription_repo.find(data);
	}

	async findOne(data: Object): Promise<Subscription> {
		if (data['id'] === NaN) return undefined;

		return this.subscription_repo.findOne(data);
	}

	async remove(user: User, room: Room): Promise<void> {
		this.subscription_repo.delete({
			user: user,
			room: room,
		});
	}
}
