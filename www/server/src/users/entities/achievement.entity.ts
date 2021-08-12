import { Column, Entity, ManyToMany} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm'
import { IsEnum, IsBoolean } from 'class-validator';
import { User } from './user.entity';


export enum AchievementsDescription {
	DEFENSE_MASTER = "You wine a match without taking any goal !",
	TEN_WINNE = "You have winned 10 games !",
	THIRTY_WINNE = "You have winned 30 games !",
	SEVENTY_WINNE = "You have winned 70 games !",
	HUNDRED_WINNE = "You have winned 100 games !",
	TWO_HUNDRED_WINNE = "You have winned 200 games !",
	ALL_TERRAIN = "You played and winne in all 3 maps in duel mode!",
	NOVICE = "You winned your first match !",
	MIDDLE_PLAYER = "You winne a match with medium difficulty !",
	HARD_MASTER = "You winne a match with Hard difficulty !",
	DONE = "You have completed all the acchievements Good Job !",
}

export enum AchievementsName {
	DEFENSE_MASTER = "Defense Master Achievement",
	TEN_WINNE = "10 Games Winned Achievement",
	THIRTY_WINNE = "30 Games Winned Achievement",
	SEVENTY_WINNE = "70 Games Winned Achievement",
	HUNDRED_WINNE = "100 Games Winned Achievement",
	TWO_HUNDRED_WINNE = "200 Games Winned Achievement",
	ALL_TERRAIN = "All Terrain Achievement",
	NOVICE = "Novice Achievement",
	MIDDLE_PLAYER = "Player In The Middle Achievement",
	HARD_MASTER = "Hardcore Player Achievement",
	DONE = "Done Achievement",
}



@Entity()
export class Achievement
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@PrimaryGeneratedColumn()
	public id : number;

    @IsEnum(AchievementsName)
    @Column({
    type: "enum",
    enum: AchievementsName,
    default: AchievementsName.NOVICE
    })
    name: AchievementsName;

    @IsEnum(AchievementsDescription)
    @Column({
    type: "enum",
    enum: AchievementsDescription,
    default: AchievementsDescription.NOVICE
    })
    description: AchievementsDescription;

    @IsBoolean()
    @Column({ default: false })
    locked: boolean;

    @Column({ default: ""})
	public image : string;
	
	@ManyToMany(() => User, user => user.achievements)
    users: User[];
        
}