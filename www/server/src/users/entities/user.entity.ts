import { Column, Entity }         from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

import { Exclude } from "class-transformer";

@Entity()
export class User
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		unique: true,
	})
	public email: string;

	@Column({
		unique: true,
	})
	public name: string;

	@Column({
		nullable: true,
	})
	public avatar?: string;

	// -------------------------------------------------------------------------
	// Authentication
	// -------------------------------------------------------------------------
	@Column({
		nullable: true,
	})
	@Exclude({
		toPlainOnly: true,
	})
	public password: string;

	@Column({
		nullable: true,
	})
	@Exclude({
		toPlainOnly: true,
	})
	public refresh_token?: string;

	@Column({
		unique: true,
		nullable: true,
	})
	@Exclude({
		toPlainOnly: true,
	})
	public marvin_id: number;

	// -------------------------------------------------------------------------
	// Relations
	// -------------------------------------------------------------------------

}
