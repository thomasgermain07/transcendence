import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Option } from 'src/game/rooms/entities/option.entity';

export class InvitationDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => Option)
	gameOptions: Option;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => User)
	host: User;

	@IsNotEmpty()
	guestId: number;
}
