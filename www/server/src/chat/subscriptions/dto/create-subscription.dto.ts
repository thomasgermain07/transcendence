import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

import { Exists } from 'src/chat/rooms/decorators/exists.decorator'

export class CreateSubscriptionDto {
  @Exists('name')
  @IsNotEmpty()
  @IsString()
  public room_name: string

  @IsString()
  @IsOptional()
  public password?: string
}
