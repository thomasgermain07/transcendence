import { IsEmail, IsOptional } from 'class-validator'
import { IsString, IsPositive } from 'class-validator'
import { MinLength, Matches } from 'class-validator'
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsUnique } from '../decorators/is-unique.decorator'
import CreateAchievementDto from "./create-achievement.dto";
export class CreateUserDto {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  // Todo:
  // @IsUnique('email')
  @IsEmail()
  public email: string

  @IsUnique('name')
  // Todo:
  @Matches(/^\w+$/, {
    message: "Name can only contains letters (a-z, A-Z), numbers (0-9) and underscore (_)."
  })
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
}
