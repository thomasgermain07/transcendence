import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator'

import { IsUnique } from '../decorators/is-unique.decorator'

export class CreateUserDto
{

	@IsEmail()
	@IsUnique('email')
	email: string

	@IsString()
	@IsNotEmpty()
	@IsUnique('name')
	name: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string

}
