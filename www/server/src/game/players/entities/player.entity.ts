import { Entity, Column, CreateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from '../../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class Player {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	position: string;

	@Column({ default: 0 })
	score: number;

	@Column({ nullable: true })
	winner: boolean;

	@Column({ default: false })
	isReady: boolean;

	@Column({ default: false })
	isPause: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user: User) => user.players, {
		nullable: false,
		eager: true,
	})
	user: User;

	@ManyToOne(() => Room, (room: Room) => room.players, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	room: Room;
}
