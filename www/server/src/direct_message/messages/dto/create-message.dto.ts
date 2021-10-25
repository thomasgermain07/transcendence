import {
	IsNotEmpty,
	IsString,
	MaxLength,
	IsNumber,
	Max,
} from 'class-validator';

import { Exists as UserExists } from 'src/users/decorators/exists.decorator';

export class CreateMessageDto {
	@UserExists('id')
	@Max(2147483647)
	@IsNumber()
	public target_id: number;

	@MaxLength(255)
	@IsNotEmpty()
	@IsString()
	public content: string;
}
