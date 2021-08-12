import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { GameMode, GameState } from '../../enum/enum';

export class UpdateRoomDto {

    @IsOptional()
    @IsEnum(GameMode)
	mode?: GameMode

    @IsBoolean()
	locked?: boolean

    @IsOptional()
    @IsEnum(GameState)
	state?: GameState
}

export default UpdateRoomDto;