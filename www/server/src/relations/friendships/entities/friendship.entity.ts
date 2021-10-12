import { Column, Entity, ManyToOne } from 'typeorm'
import { CreateDateColumn } from 'typeorm'

import { User } from 'src/users/entities/user.entity'

@Entity('relations_friendships')
export class Friendship {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @ManyToOne(() => User, (user) => user.friendships, {
    nullable: false,
    eager: true,
    primary: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => User, (user) => user.friendships_by, {
    nullable: false,
    eager: true,
    primary: true,
    onDelete: 'CASCADE',
  })
  public target: User;

  @Column('boolean', {
	  default: false,
  })
  public accepted: boolean;

  @CreateDateColumn()
  public created_at: Date;

}
