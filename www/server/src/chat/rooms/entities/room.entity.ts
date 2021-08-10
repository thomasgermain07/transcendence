import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ManyToOne, OneToMany } from 'typeorm'
import { Transform, Type } from 'class-transformer'

import { User } from 'src/users/entities/user.entity'
import { Message } from 'src/chat/messages/entities/message.entity'
import { Subscription } from 'src/chat/subscriptions/entities/subscription.entity'
import { Permission } from 'src/chat/permissions/entities/permission.entity'

@Entity('chat_rooms')
export class Room {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => User, (user) => user.chat_rooms, {
    nullable: false,
    eager: true,
  })
  @Type(() => User)
  public owner: User

  @Column({
    unique: true,
  })
  public name: string

  @Column({
    default: false,
  })
  public visible: boolean

  @Column({
    nullable: true,
  })
  @Transform(({ value }) => (value ? true : false), {
    toPlainOnly: true,
  })
  public password: string

  // -------------------------------------------------------------------------
  // Relations
  // -------------------------------------------------------------------------
  @OneToMany(() => Subscription, (subscription) => subscription.room, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public subscriptions: Promise<Subscription[]>

  @OneToMany(() => Message, (message) => message.room, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public messages: Promise<Message[]>

  @OneToMany(() => Permission, (permission) => permission.room, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public permissions: Promise<Permission[]>
}
