import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository }              from '@nestjs/typeorm'
import { Repository }                    from 'typeorm'

import { CreateUserDto } from '../dto/create-user.dto'
import { User }          from '../entities/user.entity'

@Injectable()
export class UsersService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	public async create(
		createUserDto: CreateUserDto
	)
		: Promise<User>
	{
		await this.usersRepository.insert(createUserDto);

		return this.findOne({ email: createUserDto.email });
	}

	public async findOne(
		data : Object
	)
		: Promise<User>
	{
		return this.usersRepository.findOne(data);
	}

	public async findOneOrThrow(
		data : Object
	)
		: Promise<User>
	{
		const user : User = await this.usersRepository.findOne(data);

		if (!user)
			throw new NotFoundException('User not found.');

		return user;
	}

	public async setRefreshToken(
		user : User,
		token : string,
	)
		: Promise<void>
	{
		this.usersRepository.update(user.id, { refreshToken: token })
	}

}
