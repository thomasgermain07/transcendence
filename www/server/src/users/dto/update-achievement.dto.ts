import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { CreateAchievementDto } from './create-achievement.dto';

export class UpdateAchievementDto
	extends PartialType(CreateAchievementDto)
{
	@IsBoolean()
	locked?: boolean
}
