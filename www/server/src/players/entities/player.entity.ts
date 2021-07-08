import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import  User  from 'src/users/entities/user.entity'
import Room from 'src/rooms/entities/room.entity'

@Entity()
class Player {
  @PrimaryGeneratedColumn()
  public id: number

//   @OneToOne(() => User)

  @Column()
  public position: string

  @Column({default: 0})
  public score: number

  @Column({default: 0})
  public winner: boolean

  @Column({default: false})
  public is_ready: boolean

  @ManyToOne(() => User, (user: User) => user.id, {cascade: true, eager: true})
  @JoinColumn({ name: "userId"})
  public user: User;

  @ManyToOne(() => Room, (room: Room) => room.id)
  @JoinColumn({ name: "roomId"})
  public room: Room;
}

export default Player