import { MapType, DifficultyLevel } from '../entities/option.entity';
import { IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';

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