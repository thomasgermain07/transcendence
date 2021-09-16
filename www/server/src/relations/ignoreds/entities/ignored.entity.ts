import { Entity, ManyToOne } from 'typeorm'
import { CreateDateColumn } from 'typeorm'

import { User } from 'src/users/entities/user.entity'

@Entity('relations_ignoreds')
export class Ignored {
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @ManyToOne(() => User, (user) => user.ignoreds, {
    nullable: false,
    eager: true,
    primary: true,
  })
  public user: User

  @ManyToOne(() => User, (user) => user.ignoreds_by, {
    nullable: false,
    eager: true,
    primary: true,
  })
  public target: User

  @CreateDateColumn()
  public created_at: Date
}
