import { ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { User } from '../../../users/entities/user.entity';
import { Option } from '../../rooms/entities/option.entity';
import { GameMode } from '../../enum/enum';

export class MatchmakerDto {

    // nested or exists?
    @ValidateNested()
    user: User;
    
    @IsEnum(GameMode)
    mode: GameMode;
    
    @IsOptional()
    @ValidateNested()
	options: Option

    @IsOptional()
	range: number
}

export default MatchmakerDto;