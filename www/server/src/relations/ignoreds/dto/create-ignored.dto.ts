import { IsPositive, Max } from 'class-validator';

import { Exists as UserExists } from 'src/users/decorators/exists.decorator';

export class CreateIgnoredDto {
	@UserExists('id')
	@Max(2147483647)
	@IsPositive()
	public target_id: number;
}
