import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
	extends PartialType(CreateUserDto)
{
	@IsInt()
	id: number
	
    @IsOptional()
    @IsInt()
	@Min(1)
	ladderLevel?: number

	// @IsOptional()
	// achievements?: Achievements[];
}
