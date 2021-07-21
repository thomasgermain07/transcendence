import { ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { GameMode } from 'src/game/rooms/entities/room.entity';
import { User } from '../../../users/entities/user.entity';
import { Option } from '../../rooms/entities/option.entity';

export class MatchmakerDto {

    // nested or exists?
    @ValidateNested()
    user: User;
    
    @IsEnum(GameMode)
    mode: GameMode;
    
    @IsOptional()
    @ValidateNested()
	options: Option
}

export default MatchmakerDto;