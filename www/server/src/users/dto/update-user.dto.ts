import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
	extends PartialType(CreateUserDto)
{
    @IsOptional()
    @IsInt()
	@Min(1)
	ladderLevel?: number

	@IsOptional()
    @IsString()
	avatar?: string

	@IsBoolean()
	@IsOptional()
	is_admin?: boolean[];


	// @IsOptional()
	// achievements?: Achievements[];
}
