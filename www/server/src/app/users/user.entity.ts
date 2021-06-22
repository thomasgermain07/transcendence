import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({length: 50})
    name: string;
    
    @ApiProperty()
    @Column({length: 150})
    email: string;

    @ApiProperty()
    @Column({length: 30})
    password: string;
}