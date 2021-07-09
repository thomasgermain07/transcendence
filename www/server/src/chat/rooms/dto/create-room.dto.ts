import { IsBoolean, IsOptional, IsString, Length, MinLength } from "class-validator";

import { IsUnique } from "../decorators/is-unique.decorator";

export class CreateRoomDto
{

	@IsUnique('name')
	@MinLength(3)
	@IsString()
	public name: string;

	@IsBoolean()
	public visible: boolean;

	@Length(6, 128)
	@IsString()
	@IsOptional()
	public password?: string;

}
