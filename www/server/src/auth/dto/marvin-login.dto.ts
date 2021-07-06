import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

import { IsUnique } from '../../users/decorators/is-unique.decorator'

export class MarvinLoginDto
{
	@IsUnique('marvin')
	marvinId: number
	
	@IsEmail()
	@IsUnique('email')
	email: string
	
	@IsString()
	@IsNotEmpty()
	// @IsUnique('name')
	name: string
	
	@IsString()
    avatar: string


}