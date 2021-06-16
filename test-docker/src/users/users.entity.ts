import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    name: string;
    
    @Column({length: 150})
    email: string;

    @Column({length: 30})
    password: string;
}

