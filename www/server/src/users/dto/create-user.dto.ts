import { IsEmail, IsOptional } from 'class-validator'
import { IsString, IsPositive } from 'class-validator'
import { MinLength } from 'class-validator'
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUnique } from '../decorators/is-unique.decorator'
import CreateAchievementDto from "./create-achievement.dto";
export class CreateUserDto {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @IsUnique('email')
  @IsEmail()
  public email: string

  @IsUnique('name')
  @MinLength(3)
  @IsString()
  public name: string

  @IsString()
  @IsOptional()
  public avatar?: string

  // -------------------------------------------------------------------------
  // Authentication
  // -------------------------------------------------------------------------
  @MinLength(6)
  @IsString()
  @IsOptional()
  public password?: string

  @IsUnique('marvin_id')
  @IsPositive()
  @IsOptional()
  public marvin_id?: number

  @ValidateNested()
  @Type(() => CreateAchievementDto)
  achievements?: CreateAchievementDto

  @IsOptional()
  @IsString()
  public status?: string
}
