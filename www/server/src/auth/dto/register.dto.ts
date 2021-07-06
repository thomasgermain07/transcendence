import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator'

import { IsUnique } from '../../users/decorators/is-unique.decorator'

export class RegisterDto
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