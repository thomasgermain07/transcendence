import { Column, Entity }              from "typeorm";
import { PrimaryGeneratedColumn }      from "typeorm";
import { ManyToOne, CreateDateColumn } from "typeorm";

import { User } from 'src/users/entities/user.entity';

@Entity('dm_messages')
export class Message
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(() => User, user => user.dm_messages_sent, {
		nullable: false,
		eager: true,
		onDelete: 'CASCADE',
	})
	public author: User;

	@ManyToOne(() => User, user => user.dm_messages_received, {
		nullable: false,
		eager: true,
		onDelete: 'CASCADE',
	})
	public target: User;

	@Column()
	public content: string;

	@CreateDateColumn()
	public created_at: Date;

}
