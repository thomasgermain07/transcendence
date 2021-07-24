import { IsEmail, IsOptional }  from "class-validator";
import { IsString, IsPositive } from "class-validator";
import { MinLength }            from "class-validator";

import { IsUnique } from "../decorators/is-unique.decorator";

export class CreateUserDto
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@IsUnique('email')
	@IsEmail()
	public email: string;

	@IsUnique('name')
	@MinLength(3)
	@IsString()
	public name: string;

	@IsString()
	@IsOptional()
	public avatar?: string

	// -------------------------------------------------------------------------
	// Authentication
	// -------------------------------------------------------------------------
	@MinLength(6)
	@IsString()
	@IsOptional()
	public password?: string;

	@IsUnique('marvin_id')
	@IsPositive()
	@IsOptional()
	public marvin_id?: number;

}
