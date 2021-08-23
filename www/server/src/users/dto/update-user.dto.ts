import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, Min, Max, IsString, IsEmail, MinLength } from 'class-validator';
import { IsUnique } from '../decorators/is-unique.decorator';

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
	extends PartialType(CreateUserDto)
{
	@IsInt()
	id: number

	@IsUnique('email')
	@IsEmail()
	email?: string

	@IsUnique('name')
	@MinLength(3)
	@IsString()
	name?: string

	@MinLength(6)
	@IsString()
	@IsOptional()
	password?: string
	
    @IsOptional()
    @IsInt()
	@Min(1)
	ladderLevel?: number

	@IsOptional()
    @IsString()
	avatar?: string

	@IsOptional()
    @IsString()
	twoFactorAuthenticationSecret?: string

	@IsOptional()
    @IsString()
	isTwoFactorAuthenticationEnabled?: boolean

	// @IsOptional()
	// achievements?: Achievements[];
}
