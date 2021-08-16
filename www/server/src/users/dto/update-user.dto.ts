import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
	extends PartialType(CreateUserDto)
{
	// @IsInt()
	// id: number

    @IsOptional()
    @IsInt()
	@Min(1)
	ladderLevel?: number

	@IsBoolean()
	@IsOptional()
	is_admin?: boolean[];


	// @IsOptional()
	// achievements?: Achievements[];
}
