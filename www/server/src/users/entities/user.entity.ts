import { Column, Entity } from 'typeorm'
import { PrimaryGeneratedColumn } from 'typeorm'
import { OneToMany, ManyToMany, JoinTable } from 'typeorm'

import { Exclude } 		   from 'class-transformer'
import { Min, Max, IsInt } from 'class-validator';

import { Room } from 'src/chat/rooms/entities/room.entity'
import { Message } from 'src/chat/messages/entities/message.entity'
import { Permission } from 'src/chat/permissions/entities/permission.entity'
import { Subscription } from 'src/chat/subscriptions/entities/subscription.entity'
import { Player } from 'src/game/players/entities/player.entity';
import { Achievement } from './achievement.entity';

@Entity()
export class User {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
  })
  public email: string

  @Column({
    unique: true,
  })
  public name: string

  @Column({
    nullable: true,
  })
  public avatar?: string

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  // -------------------------------------------------------------------------
  // Authentication
  // -------------------------------------------------------------------------
  @Column({
    nullable: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  public password: string

  @Column({
    nullable: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  public refresh_token?: string

  @Column({
    unique: true,
    nullable: true,
  })
  @Exclude({
    toPlainOnly: true,
  })
  public marvin_id: number

  // -------------------------------------------------------------------------
  // Chat
  // -------------------------------------------------------------------------
  @OneToMany(() => Room, (room) => room.owner, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public chat_rooms: Promise<Room[]>

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public chat_subscriptions: Promise<Subscription[]>

  @OneToMany(() => Message, (message) => message.author, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public chat_messages: Promise<Message[]>

  @OneToMany(() => Permission, (permission) => permission.user, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  public chat_permissions: Promise<Permission[]>

	// -------------------------------------------------------------------------
	// Game
	// -------------------------------------------------------------------------
	@Column({ default: 50 })
	ladderLevel : number;

  @ManyToMany(() => Achievement, achievement => achievement.users, { cascade: true, eager: true})
	@JoinTable()
	achievements: Achievement[];

  @OneToMany(() => Player, player => player.user)
	players: Player[];
}
