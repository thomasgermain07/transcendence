import { Column, Entity }         from 'typeorm'
import { PrimaryGeneratedColumn } from 'typeorm'

import { Exclude } from 'class-transformer'

@Entity()
export class User
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@PrimaryGeneratedColumn()
	public id : number;

	@Column({ unique: true })
	public email : string;

	@Column({ unique: true })
	public name : string;

	@Column({ unique: true, nullable: true })
	public marvinId: number
  
	@Column({ nullable: true })
	public avatar: string

	// -------------------------------------------------------------------------
	// Authentication
	// -------------------------------------------------------------------------
	@Column({ nullable: true })
	@Exclude()
	public password : string;

	@Column({ nullable: true })
	@Exclude()
	public refreshToken? : string;

	// -------------------------------------------------------------------------
	// Relations
	// -------------------------------------------------------------------------

}
