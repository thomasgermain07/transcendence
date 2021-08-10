import { IsDate, IsOptional, IsPositive, IsString, Max } from 'class-validator';

import { Exists as UserExists } from 'src/users/decorators/exists.decorator'
import { Exists as RoomExists } from 'src/chat/rooms/decorators/exists.decorator'

import { IsValidType } from '../decorators/is-valid-type.decorator'
import { Type }        from 'class-transformer';

export class CreatePermissionDto
{

	@UserExists()
	@Max(2147483647)
	@IsPositive()
	public user_id: number;

	@RoomExists('id')
	@Max(2147483647)
	@IsPositive()
	public room_id: number;

	@IsValidType()
	@IsString()
	public type: string;

	// const d = new Date();
	// d.setHours(d.getHours() + 6);
	// d.toISOString();
	@IsDate()
	@IsOptional()
	@Type(() => Date)
	public expired_at?: Date;
}
