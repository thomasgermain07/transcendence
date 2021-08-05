import { Column, Entity } from 'typeorm'
import { PrimaryGeneratedColumn } from 'typeorm'
import { OneToMany } from 'typeorm'

import { Exclude } 		   from 'class-transformer'
import { Min, Max, IsInt } from 'class-validator';

import { Room } from 'src/chat/rooms/entities/room.entity'
import { Message } from 'src/chat/messages/entities/message.entity'
import { Permission } from 'src/chat/permissions/entities/permission.entity'
import { Subscription } from 'src/chat/subscriptions/entities/subscription.entity'
import { Player } from 'src/game/players/entities/player.entity';

export enum Achievements {
	DEFENSE_MASTER = "Defense Master Achievement: You wine a match without taking any goal !",
	TEN_WINNE = "10 Games Winned Achievement: You have winned 10 games !",
	THIRTY_WINNE = "30 Games Winned Achievement: You have winned 30 games !",
	SEVENTY_WINNE = "70 Games Winned Achievement: You have winned 70 games !",
	HUNDRED_WINNE = "100 Games Winned Achievement: You have winned 100 games !",
	TWO_HUNDRED_WINNE = "200 Games Winned Achievement: You have winned 200 games !",
	LADDER_WINNER = "Ladder Winner Achievement: You are Level 1 in Ladder mode !",
	ALL_TERRAIN = "All Terrain Achievement: You played and winne in all 3 maps in duel mode!",
	NOVICE = "Novice Achievement: You winned your first match !",
	MIDDLE_PLAYER = "Player In The Middle Achievement: You winne a match with medium difficulty !",
	HARD_MASTER = "Hardcore Player Achievement: You winne a match with Hard difficulty !",
	DONE = "Done Achievement: You have completed all the acchievements Good Job !",
}

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
	@Column({ default: 5 })
	@IsInt()
  @Min(1)
	ladderLevel : number;
	
	@Column('text', { nullable: true, array: true })
	public achievements : Achievements[];

  @OneToMany(() => Player, player => player.user)
	players: Player[];
}
