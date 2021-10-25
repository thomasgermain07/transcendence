import { IsString } from 'class-validator';
import { MinLength, Matches } from 'class-validator';
import { IsUnique } from '../decorators/is-unique.decorator';

export class EditUserDto {
	public name: string;

	@IsUnique('name')
	@Matches(/^\w+$/, {
		message:
			'Name can only contains letters (a-z, A-Z), numbers (0-9) and underscore (_).',
	})
	@MinLength(3)
	@IsString()
	public new_name: string;
}
