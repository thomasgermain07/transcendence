import { IsNotEmpty, IsPositive, IsString, Max } from 'class-validator'

import { Exists } from 'src/chat/rooms/decorators/exists.decorator'

export class CreateMessageDto {
  @Exists('id')
  @Max(2147483647)
  @IsPositive()
  public room_id: number

  @IsNotEmpty()
  @IsString()
  public content: string
}
