import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import  Player  from 'src/players/entities/player.entity'
import  User  from 'src/users/entities/user.entity'

@Entity()
class Room {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public status: string

  @Column()
  public game_mode: string

  @Column({unique: true})
  public name: string

  // @OneToMany(() => User, (user: User) => user.rooms, {cascade: true})
  // public user: User[];

  @OneToMany(() => Player, (player: Player) => player.room, {cascade: true, eager: true})
  public players: Player[];
}

export default Room
