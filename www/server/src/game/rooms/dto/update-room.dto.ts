import { GameMode } from "../entities/room.entity";
import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto {

    @IsOptional()
    @IsEnum(GameMode)
	mode?: GameMode

    @IsBoolean()
	locked?: boolean

    //state
}

export default UpdateRoomDto;