import { IsOptional, IsPositive, IsString, Max } from 'class-validator';

import { Exists } from 'src/chat/rooms/decorators/exists.decorator'

export class CreateSubscriptionDto
{

	@Exists()
	@Max(2147483647)
	@IsPositive()
	public room_id: number;

	@IsString()
	@IsOptional()
	public password?: string;

}
