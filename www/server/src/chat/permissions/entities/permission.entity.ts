import { Column, Entity } from 'typeorm'
import { ManyToOne } from 'typeorm'
import { Type } from 'class-transformer'

import { User } from 'src/users/entities/user.entity'
import { Room } from 'src/chat/rooms/entities/room.entity'

export enum PermissionType {
  MODERATOR = 'moderator',
  MUTED = 'muted',
  BANNED = 'banned',
}

@Entity('chat_permissions')
export class Permission {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @ManyToOne(() => User, (user) => user.chat_permissions, {
    nullable: false,
    primary: true,
    eager: true,
  })
  @Type(() => User)
  public user: User

  @ManyToOne(() => Room, (room) => room.permissions, {
    nullable: false,
    primary: true,
    eager: true,
  })
  @Type(() => Room)
  public room: Room

  @Column({
    type: 'enum',
    enum: PermissionType,
  })
  @Type(() => String)
  public type: PermissionType

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  @Type(() => Date)
  public expired_at: Date
}
