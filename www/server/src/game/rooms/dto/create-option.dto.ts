import { IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { MapType, DifficultyLevel } from '../../enum/enum';

export class CreateOptionDto {

    @IsNotEmpty()
    @IsEnum(MapType)
	map: MapType
    
    @IsNotEmpty()
    @IsEnum(DifficultyLevel)
    difficulty: DifficultyLevel
    
    @IsNotEmpty()
    @IsBoolean()
    powerUps: boolean
}

export default CreateOptionDto;