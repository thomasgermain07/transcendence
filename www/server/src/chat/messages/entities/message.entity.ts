import { Column, Entity } from 'typeorm'
import { PrimaryGeneratedColumn } from 'typeorm'
import { ManyToOne, CreateDateColumn } from 'typeorm'

import { User } from 'src/users/entities/user.entity'
import { Room } from 'src/chat/rooms/entities/room.entity'

@Entity('chat_messages')
export class Message {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => User, (user) => user.chat_messages, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  public author: User

  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  public room: Room

  @Column()
  public content: string

  @CreateDateColumn()
  public created_at: Date
}
