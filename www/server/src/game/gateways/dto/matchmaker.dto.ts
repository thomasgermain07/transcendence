import { ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Option } from '../../rooms/entities/option.entity';
import { GameMode } from '../../enum/enum';

export class MatchmakerDto {
	@IsEnum(GameMode)
	mode: GameMode;

	@IsOptional()
	@ValidateNested()
	options: Option;

	@IsOptional()
	range: number;
}

export default MatchmakerDto;
