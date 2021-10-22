import { IsNotEmpty, IsEnum } from 'class-validator';
import {
	AchievementsName,
	AchievementsDescription,
} from '../entities/achievement.entity';

export class CreateAchievementDto {
	@IsNotEmpty()
	@IsEnum(AchievementsName)
	name: AchievementsName;

	@IsNotEmpty()
	@IsEnum(AchievementsDescription)
	description: AchievementsDescription;
}

export default CreateAchievementDto;
