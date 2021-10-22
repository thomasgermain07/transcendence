import { IsEmail, IsOptional } from 'class-validator'
import { IsString, IsPositive } from 'class-validator'
import { Length, Matches } from 'class-validator'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsUnique } from '../decorators/is-unique.decorator'
import CreateAchievementDto from './create-achievement.dto'
export class CreateUserDto {
  @IsEmail()
  public email: string

  @IsUnique('name')
  @Matches(/^\w+$/, {
    message:
      'Name can only contains letters (a-z, A-Z), numbers (0-9) and underscore (_).',
  })
  @Length(3, 21)
  @IsString()
  public name: string

  @IsString()
  @IsOptional()
  public avatar?: string

  @Length(6)
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
