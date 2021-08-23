import { IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import CreateOptionDto from "./create-option.dto";
import { GameMode } from '../../enum/enum';


export class CreateRoomDto {

    @IsNotEmpty()
    @IsEnum(GameMode)
    mode: GameMode

    @ValidateNested()
    @Type(() => CreateOptionDto)
    option?: CreateOptionDto

}

export default CreateRoomDto;