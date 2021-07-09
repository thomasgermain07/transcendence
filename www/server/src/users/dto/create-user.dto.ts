import { IsEmail, IsString, MinLength, IsOptional, IsPositive } from 'class-validator'

import { IsUnique } from '../decorators/is-unique.decorator'

export class CreateUserDto
{

	@IsUnique('email')
	@IsEmail()
	email: string

	@IsUnique('name')
	@MinLength(3)
	@IsString()
	name: string

	@MinLength(6)
	@IsString()
	@IsOptional()
	password?: string

	@IsUnique('marvinId')
	@IsPositive()
	@IsOptional()
	marvinId?: number

	@IsString()
	@IsOptional()
	avatar?: string

}

export default CreateUserDto;
