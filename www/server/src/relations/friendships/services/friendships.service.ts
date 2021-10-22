import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Friendship } from "../entities/friendship.entity";

@Injectable()
export class FriendshipsService
{
	constructor(
		@InjectRepository(Friendship)
		private readonly frienships_repo: Repository<Friendship>,
	)
	{

	}

	async create(
		user: User,
		target: User,
	)
		: Promise<Friendship>
	{
		const friendship: Friendship = this.frienships_repo.create();
		friendship.user = user;
		friendship.target = target;

		return this.frienships_repo.save(friendship);
	}

	async findAllOrWithAccepted(
		user: User,
		accepted: boolean,
	)
		: Promise<Friendship[]>
	{
		return this.frienships_repo.find({
			where: [
				{ user:   user, accepted: accepted },
				{ target: user, accepted: accepted },
			],
		});
	}

	async findOneOr(
		user: User,
		target: User,
	)
		: Promise<Friendship>
	{
		return this.frienships_repo.findOne({
			where: [
				{ user: user,   target: target },
				{ user: target, target: user   },
			],
		});
	}

	async update(
		friendship: Friendship,
	)
		: Promise<Friendship>
	{
		return this.frienships_repo.save(friendship);
	}

	async remove(
		user: User,
		target: User,
	)
		: Promise<void>
	{
		this.frienships_repo.delete({
			user: user,
			target: target,
		});

		this.frienships_repo.delete({
			user: target,
			target: user,
		});
	}

}
