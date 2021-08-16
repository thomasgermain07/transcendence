import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'
import { Achievement } from '../entities/achievement.entity'

import { AchievementsName, AchievementsDescription } from '../entities/achievement.entity'

@Injectable()
export class UsersService {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    @InjectRepository(User)
    private readonly users_repo: Repository<User>,
    @InjectRepository(Achievement)
		private achievementsRepository: Repository<Achievement>
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async create(create_dto: CreateUserDto): Promise<User> {
    const achievement_1 = this.achievementsRepository.create({name: AchievementsName.NOVICE, description: AchievementsDescription.NOVICE});

		const achievement_2 = this.achievementsRepository.create({ name: AchievementsName.ALL_TERRAIN, description: AchievementsDescription.ALL_TERRAIN});

		const achievement_3 = this.achievementsRepository.create({ name: AchievementsName.DEFENSE_MASTER, description: AchievementsDescription.DEFENSE_MASTER });

		const achievement_4 = this.achievementsRepository.create({ name: AchievementsName.DONE, description: AchievementsDescription.DONE });

		const achievement_5 = this.achievementsRepository.create({ name: AchievementsName.HARD_MASTER, description: AchievementsDescription.HARD_MASTER });

		const achievement_6 = this.achievementsRepository.create({ name: AchievementsName.HUNDRED_WINS, description: AchievementsDescription.NOVICE });

		const achievement_7 = this.achievementsRepository.create({ name: AchievementsName.MIDDLE_PLAYER, description: AchievementsDescription.MIDDLE_PLAYER });

		const achievement_8 = this.achievementsRepository.create({ name: AchievementsName.SEVENTY_WINS, description: AchievementsDescription.SEVENTY_WINS });

		const achievement_9 = this.achievementsRepository.create({ name: AchievementsName.TEN_WINS, description: AchievementsDescription.TEN_WINS });

		const achievement_10 = this.achievementsRepository.create({ name: AchievementsName.THIRTY_WINS, description: AchievementsDescription.THIRTY_WINS });

		const achievement_11 = this.achievementsRepository.create({ name: AchievementsName.TWO_HUNDRED_WINS, description: AchievementsDescription.TWO_HUNDRED_WINS });

		const user: User = this.users_repo.create({...create_dto, achievements: []})
		user.achievements = [achievement_1, achievement_2, achievement_3, achievement_4, achievement_5, achievement_6, achievement_7, achievement_8, achievement_9, achievement_10, achievement_11]
    
    return await this.users_repo.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.users_repo.find()
  }

  async findOne(data: Object): Promise<User> {
    return this.users_repo.findOne(data)
  }

  async setRefreshToken(user: User, token: string): Promise<void> {
    this.users_repo.update(user.id, {
      refresh_token: token,
    })
  }

  async update(user: User, update_dto: UpdateUserDto): Promise<User> {
    const user_update: User = this.users_repo.create(user)
    Object.assign(user_update, update_dto)

    return this.users_repo.save(user_update)
  }

  async remove(user: User): Promise<void> {
    this.users_repo.remove(user)
  }

  public async findOneLadderLevel(
  	userId : number,
  )
  	: Promise<number>
  {
  	const user : User = await this.users_repo.findOne(userId, {
  		relations: ["players"]
  	});  
  	if (!user)
  		throw new NotFoundException('User not found.');  
  	return user.ladderLevel;
  }

  public async updateLadderLevel(
  	userId : number,
  	level : number,
  )
  	: Promise<User>
  {
    await this.users_repo.update(userId, { ladderLevel: level })
    
  	return await this.users_repo.findOne(userId);
  }

  public async updateAchievements(
  	userPlayer : User,
		achievementName : AchievementsName,
	)
		: Promise<User>
	{
		const achievement = await this.achievementsRepository.createQueryBuilder("achievement")
			.leftJoinAndSelect("achievement.users", "users")
			.where(`"users"."id" = :id`, { id: userPlayer.id })
			.andWhere(`"achievement"."name" = :name`, { name: achievementName })
			.getOne()
		
		await this.achievementsRepository.update(achievement.id, {locked: true})

		return await this.users_repo.findOne(userPlayer.id);
	}

}