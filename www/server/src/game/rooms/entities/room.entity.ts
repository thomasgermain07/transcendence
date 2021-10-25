import { Entity, Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne, OneToMany } from 'typeorm';

import { Option } from './option.entity';
import { Player } from 'src/game/players/entities/player.entity';
import { GameState, GameMode } from '../../enum/enum';

@Entity({ name: 'game_room' })
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: GameMode,
		default: GameMode.DUEL,
	})
	mode: GameMode;

	@Column({
		type: 'enum',
		enum: GameState,
		default: GameState.WAITING,
	})
	state: GameState;

	@Column({ default: false })
	locked: boolean;

	@OneToOne(() => Option, (option) => option.room, {
		cascade: true,
		eager: true,
	})
	option: Option;

	@OneToMany(() => Player, (player) => player.room, {
		eager: true,
	})
	players: Player[];
}
