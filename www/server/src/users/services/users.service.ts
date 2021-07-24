import { Injectable }       from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository }       from "typeorm";

import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User }          from "../entities/user.entity";

@Injectable()
export class UsersService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(User)
		private readonly users_repo: Repository<User>,
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
		return this.users_repo.save(create_dto);
	}

	async findAll()
		: Promise<User[]>
	{
		return this.users_repo.find();
	}

	async findOne(
		data: Object,
	)
		: Promise<User>
	{
		return this.users_repo.findOne(data);
	}

	async setRefreshToken(
		user: User,
		token: string,
	)
		: Promise<void>
	{
		this.users_repo.update(user.id, {
			refresh_token: token
		});
	}

	async update(
		user: User,
		update_dto: UpdateUserDto,
	)
		: Promise<User>
	{
		const user_update: User = this.users_repo.create(user);
		Object.assign(user_update, update_dto);

		return this.users_repo.save(user_update);
	}

	async remove(
		user: User,
	)
		: Promise<void>
	{
		this.users_repo.remove(user);
	}

}
