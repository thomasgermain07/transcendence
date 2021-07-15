import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsBoolean } from 'class-validator';
import { Room } from './room.entity';


export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum MapType {
  DEFAULT = 'default',
  MAP1 = 'map1',
  MAP2 = 'map2'
}

@Entity({ name: 'game_option'})
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(MapType)
  @Column({
    type: "enum",
    enum: MapType,
    default: MapType.DEFAULT
  })
  map: MapType;

  @IsEnum(DifficultyLevel)
  @Column({
    type: "enum",
    enum: DifficultyLevel,
    default: DifficultyLevel.EASY
  })
  difficulty: DifficultyLevel;

  @IsBoolean()
  @Column({ default: false })
  powerUps: boolean;

  @OneToOne(() => Room, (room: Room) => room.option, { onDelete: "CASCADE" })
  @JoinColumn()
  room: Room;
}