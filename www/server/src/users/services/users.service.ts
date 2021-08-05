import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'

export enum Achievements {
	DEFENSE_MASTER = "Defense Master Achievement: You wine a match without taking any goal !",
	TEN_WINNE = "10 Games Winned Achievement: You have winned 10 games !",
	THIRTY_WINNE = "30 Games Winned Achievement: You have winned 30 games !",
	SEVENTY_WINNE = "70 Games Winned Achievement: You have winned 70 games !",
	HUNDRED_WINNE = "100 Games Winned Achievement: You have winned 100 games !",
	TWO_HUNDRED_WINNE = "200 Games Winned Achievement: You have winned 200 games !",
	LADDER_WINNER = "Ladder Winner Achievement: You are Level 1 in Ladder mode !",
	ALL_TERRAIN = "All Terrain Achievement: You played and winne in all 3 maps in duel mode!",
	NOVICE = "Novice Achievement: You winned your first match !",
	MIDDLE_PLAYER = "Player In The Middle Achievement: You winne a match with medium difficulty !",
	HARD_MASTER = "Hardcore Player Achievement: You winne a match with Hard difficulty !",
	DONE = "Done Achievement: You have completed all the acchievements Good Job !",
}

@Injectable()
export class UsersService {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    @InjectRepository(User)
    private readonly users_repo: Repository<User>,
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async create(create_dto: CreateUserDto): Promise<User> {
    return this.users_repo.save(create_dto)
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
  	if (level == 1) {
  		const user : User = await this.users_repo.findOne(userId)
  		await this.updateAchievements(user, Achievements.LADDER_WINNER)
  	}
  	return await this.users_repo.findOne(userId);
  }

  public async updateAchievements(
  	user : User,
  	achievement : Achievements,
  )
  	: Promise<User>
  {
  	if (!user.achievements) {
  		user.achievements = [];
  	}
  	console.log(user);
  	if (user.achievements && !user.achievements.find(element => element == achievement)) {
  		user.achievements.push(achievement);
  		await this.users_repo.update(user.id, { achievements: user.achievements })
  	}
  	return await this.users_repo.findOne(user.id);
  }

}