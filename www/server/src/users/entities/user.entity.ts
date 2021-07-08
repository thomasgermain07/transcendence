import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import  Player  from '../../players/entities/player.entity'
import Room from '../../rooms/entities/room.entity'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ unique: true })
  public email: string

  @Column()
  public name: string

  @Column()
  @Exclude()
  public password: string

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string

  @OneToMany(() => Player, (player: Player) => player.user)
  public players: Player[];

  // @OneToMany(() => Room, (room: Room) => room.user)
  // public rooms: Room[];
}

export default User
