import { Injectable }          from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'
import * as bcrypt             from 'bcrypt'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User }          from 'src/users/entities/user.entity'
import { UsersService }  from 'src/users/services/users.service'
import { MarvinLoginDto } from '../dto/marvin-login.dto'
import { RegisterDto }	 from '../dto/register.dto'
import { AuthenticationPayload } from '../interfaces/authentication-payload.interface'

@Injectable()
export class AuthService
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly users_svc: UsersService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	public async register(
		registrationData: RegisterDto
	)
		: Promise<User>
	{
		registrationData.password = await this.hashSecure(registrationData.password);

		return this.users_svc.create(registrationData);
	}

	public async findOrCreateAuthMarvinUser(data: MarvinLoginDto) {
		let user: User = await this.users_svc.findOne(data);

		if (!user)
			user = await this.users_svc.create({ ...data });

		return user
	}

	async authenticate(
		data: AuthenticationPayload,
	)
		: Promise<User>
	{
		const credentials = {};
		data.id    ? credentials['id']    = data.id    : null;
		data.email ? credentials['email'] = data.email : null;

		const user: User = await this.users_svc.findOne(credentials);

		if (!user)
			return undefined;

		if (data.password && !await this.hashVerify(data.password, user.password))
			return undefined;

		if (data.token && !await this.hashVerify(data.token, user.refreshToken))
			return undefined;

		return user;
	}

	async refresh(
		user: User,
		token: string,
	)
		: Promise<void>
	{
		await this.users_svc.setRefreshToken(user, await this.hashSecure(token));
	}

	async logout(
		user: User,
	)
		: Promise<void>
	{
		return this.users_svc.setRefreshToken(user, null);
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private async hashSecure(
		data: string,
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
