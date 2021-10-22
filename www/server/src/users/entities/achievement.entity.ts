import { Column, Entity, ManyToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsBoolean } from 'class-validator';
import { User } from './user.entity';

export enum AchievementsDescription {
	DEFENSE_MASTER = 'You won a match without taking any goal !',
	TEN_WINS = 'You have won 10 games !',
	THIRTY_WINS = 'You have won 30 games !',
	SEVENTY_WINS = 'You have won 70 games !',
	HUNDRED_WINS = 'You have won 100 games !',
	TWO_HUNDRED_WINS = 'You have won 200 games !',
	ALL_TERRAIN = 'You played and won in all 3 maps in duel mode !',
	NOVICE = 'You won your first match !',
	MIDDLE_PLAYER = 'You won a match with medium difficulty !',
	HARD_MASTER = 'You won a match with Hard difficulty !',
	DONE = 'You have completed all the achievements Good Job !',
}

export enum AchievementsName {
	DEFENSE_MASTER = 'Defense Master Achievement',
	TEN_WINS = '10 Games Won Achievement',
	THIRTY_WINS = '30 Games Won Achievement',
	SEVENTY_WINS = '70 Games Won Achievement',
	HUNDRED_WINS = '100 Games Won Achievement',
	TWO_HUNDRED_WINS = '200 Games Won Achievement',
	ALL_TERRAIN = 'All Terrain Achievement',
	NOVICE = 'Novice Achievement',
	MIDDLE_PLAYER = 'Player In The Middle Achievement',
	HARD_MASTER = 'Hardcore Player Achievement',
	DONE = 'All Done Achievement',
}

export enum AchievementsImage {
	DEFENSE_MASTER = 'http://localhost:8080/achievements/defense.png',
	TEN_WINS = 'http://localhost:8080/achievements/wins-ten.png',
	THIRTY_WINS = 'http://localhost:8080/achievements/wins-thirty.png',
	SEVENTY_WINS = 'http://localhost:8080/achievements/wins-seventy.png',
	HUNDRED_WINS = 'http://localhost:8080/achievements/wins-hundred.png',
	TWO_HUNDRED_WINS = 'http://localhost:8080/achievements/wins-two-hundred.png',
	ALL_TERRAIN = 'http://localhost:8080/achievements/all-terrain.png',
	NOVICE = 'http://localhost:8080/achievements/novice.png',
	MIDDLE_PLAYER = 'http://localhost:8080/achievements/medium.png',
	HARD_MASTER = 'http://localhost:8080/achievements/hard.png',
	DONE = 'http://localhost:8080/achievements/done.png',
}

export const defaultAchievements = [
	{
		name: AchievementsName.DEFENSE_MASTER,
		description: AchievementsDescription.DEFENSE_MASTER,
		image: AchievementsImage.DEFENSE_MASTER,
	},
	{
		name: AchievementsName.TEN_WINS,
		description: AchievementsDescription.TEN_WINS,
		image: AchievementsImage.TEN_WINS,
	},
	{
		name: AchievementsName.THIRTY_WINS,
		description: AchievementsDescription.THIRTY_WINS,
		image: AchievementsImage.THIRTY_WINS,
	},
	{
		name: AchievementsName.SEVENTY_WINS,
		description: AchievementsDescription.SEVENTY_WINS,
		image: AchievementsImage.SEVENTY_WINS,
	},
	{
		name: AchievementsName.HUNDRED_WINS,
		description: AchievementsDescription.HUNDRED_WINS,
		image: AchievementsImage.HUNDRED_WINS,
	},
	{
		name: AchievementsName.TWO_HUNDRED_WINS,
		description: AchievementsDescription.TWO_HUNDRED_WINS,
		image: AchievementsImage.TWO_HUNDRED_WINS,
	},
	{
		name: AchievementsName.ALL_TERRAIN,
		description: AchievementsDescription.ALL_TERRAIN,
		image: AchievementsImage.ALL_TERRAIN,
	},
	{
		name: AchievementsName.NOVICE,
		description: AchievementsDescription.NOVICE,
		image: AchievementsImage.NOVICE,
	},
	{
		name: AchievementsName.MIDDLE_PLAYER,
		description: AchievementsDescription.MIDDLE_PLAYER,
		image: AchievementsImage.MIDDLE_PLAYER,
	},
	{
		name: AchievementsName.HARD_MASTER,
		description: AchievementsDescription.HARD_MASTER,
		image: AchievementsImage.HARD_MASTER,
	},
	{
		name: AchievementsName.DONE,
		description: AchievementsDescription.DONE,
		image: AchievementsImage.DONE,
	},
];

@Entity()
export class Achievement {
	@PrimaryGeneratedColumn()
	public id: number;

	@IsEnum(AchievementsName)
	@Column({
		type: 'enum',
		enum: AchievementsName,
		default: AchievementsName.NOVICE,
	})
	name: AchievementsName;

	@IsEnum(AchievementsDescription)
	@Column({
		type: 'enum',
		enum: AchievementsDescription,
		default: AchievementsDescription.NOVICE,
	})
	description: AchievementsDescription;

	@IsBoolean()
	@Column({ default: true })
	locked: boolean;

	@Column({ default: '' })
	public image: string;

	@ManyToMany(() => User, (user) => user.achievements)
	users: User[];
}
