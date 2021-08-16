import { Injectable }       from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Ignored } from '../entities/ignored.entity';

@Injectable()
export class IgnoredsService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(Ignored)
		private readonly ignoreds_repo: Repository<Ignored>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async create(
		user: User,
		target: User,
	)
		: Promise<Ignored>
	{
		const ignored: Ignored = this.ignoreds_repo.create();
		ignored.user = user;
		ignored.target = target;

		return this.ignoreds_repo.save(ignored);
	}

	async findAll(
		user: User,
	)
		: Promise<Ignored[]>
	{
		return this.ignoreds_repo.find({
			where: { user: user },
		})
	}

	async remove(
		user: User,
		target: User,
	)
		: Promise<void>
	{
		this.ignoreds_repo.delete({
			user: user,
			target: target,
		});
	}

}
