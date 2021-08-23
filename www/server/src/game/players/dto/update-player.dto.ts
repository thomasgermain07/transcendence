import { IsBoolean, IsOptional } from 'class-validator';
import { IsInt, Min, Max } from 'class-validator';

export class UpdatePlayerDto {

    // @IsOptional()
    @IsInt()
    @Min(0)
    @Max(5)
    score?: number;
    
    // @IsOptional()
    @IsBoolean()
    winner?: boolean;
    
    // @IsOptional()
    @IsBoolean()
	isReady?: boolean
}

export default UpdatePlayerDto;