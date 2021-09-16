import { PartialType } from '@nestjs/mapped-types'
import { IsOptional } from 'class-validator'
import { IsBoolean, IsInt, Min } from 'class-validator'
import { IsString } from 'class-validator'

import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  ladderLevel?: number

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean[]

  // @IsOptional()
  // @IsString()
  // twoFactorAuthenticationSecret?: string

  @IsOptional()
  @IsString()
  isTwoFactorAuthenticationEnabled?: boolean

  // @IsOptional()
  // achievements?: Achievements[];
}
