import { Injectable }        from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository }  from '@nestjs/typeorm';
import { Repository }        from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User }          from '../entities/user.entity'

@Injectable()
export class UsersService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(User)
		private readonly user_repo: Repository<User>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	async create(
		create_dto: CreateUserDto,
	)
		: Promise<User>
	{
		const user: User = this.user_repo.create(create_dto);

		return this.user_repo.save(user);
	}

	async findAll()
		: Promise<User[]>
	{
		return this.user_repo.find();
	}

	async findOne(
		data: Object,
	)
		: Promise<User>
	{
		return this.user_repo.findOne(data);
	}

	async update(
		user: User,
		update_dto: UpdateUserDto,
	)
		: Promise<User>
	{
		const user_update: User = this.user_repo.create(user);
		Object.assign(user_update, update_dto);

		return this.user_repo.save(user_update);
	}

	async setRefreshToken(
		user: User,
		token: string,
	)
		: Promise<void>
	{
		this.user_repo.update(user.id, { refreshToken: token });
	}

	async remove(
		user: User,
	)
		: Promise<void>
	{
		this.user_repo.remove(user);
	}

}
