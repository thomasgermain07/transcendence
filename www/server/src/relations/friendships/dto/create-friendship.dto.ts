import { IsNotEmpty, IsString } from 'class-validator';

import { Exists as UserExists } from 'src/users/decorators/exists.decorator';

export class CreateFriendshipDto {
	@UserExists('name')
	@IsNotEmpty()
	@IsString()
	public target_name: string;
}
