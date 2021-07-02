import { Injectable }          from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'
import * as bcrypt             from 'bcrypt'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User }          from 'src/users/entities/user.entity'
import { UsersService }  from 'src/users/services/users.service'

@Injectable()
export class AuthService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly usersService: UsersService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	public async register(
		create_user_dto : CreateUserDto
	)
		: Promise<User>
	{
		create_user_dto.password = await this.hashSecure(create_user_dto.password);

		return this.usersService.create(create_user_dto);
	}

	public async authenticateByCredentials(
		email : string,
		password : string,
	)
		: Promise<User>
	{
		const user : User = await this.usersService.findOne({ email: email });

		if (!user || !await this.hashVerify(password, user.password))
			throw new BadRequestException('Wrong credentials provided');

		return user;
	}

	public async authenticateById(
		user_id : number,
	)
		: Promise<User>
	{
		return this.usersService.findOneOrThrow(user_id);
	}

	public async authenticateByRefreshToken(
		user_id : number,
		token : string,
	)
		: Promise<User>
	{
		const user = await this.usersService.findOneOrThrow(user_id);

		return await this.hashVerify(token, user.refreshToken) ? user : undefined;
	}

	public async refresh(
		user : User,
		token : string,
	)
		: Promise<void>
	{
		await this.usersService.setRefreshToken(user, await this.hashSecure(token));
	}

	public async logout(
		user : User,
	)
		: Promise<void>
	{
		return this.usersService.setRefreshToken(user, null);
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private async hashSecure(
		data : string,
	)
		: Promise<string>
	{
		return bcrypt.hash(data, 10);
	}

	private async hashVerify(
		data : string,
		hashed_data : string,
	)
		: Promise<boolean>
	{
		return bcrypt.compare(data, hashed_data);
	}

}
