import { GameMode } from "../entities/room.entity";
import { IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import CreateOptionDto from "./create-option.dto";


export class CreateRoomDto {

    @IsNotEmpty()
    @IsEnum(GameMode)
	mode: GameMode

    @ValidateNested()
    @Type(() => CreateOptionDto)
    option?: CreateOptionDto

}

export default CreateRoomDto;