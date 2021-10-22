import { Entity, ManyToOne } from 'typeorm'
import { Type } from 'class-transformer'

import { User } from 'src/users/entities/user.entity'
import { Room } from 'src/chat/rooms/entities/room.entity'

@Entity('chat_subscriptions')
export class Subscription {
  @ManyToOne(() => User, (user) => user.chat_subscriptions, {
    nullable: false,
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @Type(() => User)
  public user: User

  @ManyToOne(() => Room, (room) => room.subscriptions, {
    nullable: false,
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @Type(() => Room)
  public room: Room
}
