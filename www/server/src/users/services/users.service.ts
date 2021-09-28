import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { Message } from 'src/direct_message/messages/entities/message.entity'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'
import { Achievement } from '../entities/achievement.entity'
import { AchievementsImage } from '../entities/achievement.entity'
import { AchievementsName } from '../entities/achievement.entity'
import { AchievementsDescription } from '../entities/achievement.entity'

@Injectable()
export class UsersService {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    @InjectRepository(User)
    private readonly users_repo: Repository<User>,
    @InjectRepository(Achievement)
    private achievementsRepository: Repository<Achievement>,
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  async turnOnTwoFactorAuthentication(userId: number): Promise<void> {
    await this.users_repo.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    })
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<void> {
    await this.users_repo.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
    })
  }

  async setTwoFactorAuthenticationSecret(
    secret: string,
    userId: number,
  ): Promise<void> {
    await this.users_repo.update(userId, {
      twoFactorAuthenticationSecret: secret,
    })
  }

  async create(create_dto: CreateUserDto): Promise<User> {
    const achievement_1 = this.achievementsRepository.create({
      name: AchievementsName.NOVICE,
      description: AchievementsDescription.NOVICE,
      image: AchievementsImage.NOVICE,
    })

    const achievement_2 = this.achievementsRepository.create({
      name: AchievementsName.TEN_WINS,
      description: AchievementsDescription.TEN_WINS,
      image: AchievementsImage.TEN_WINS,
    })

    const achievement_3 = this.achievementsRepository.create({
      name: AchievementsName.THIRTY_WINS,
      description: AchievementsDescription.THIRTY_WINS,
      image: AchievementsImage.THIRTY_WINS,
    })

    const achievement_4 = this.achievementsRepository.create({
      name: AchievementsName.SEVENTY_WINS,
      description: AchievementsDescription.SEVENTY_WINS,
      image: AchievementsImage.SEVENTY_WINS,
    })

    const achievement_5 = this.achievementsRepository.create({
      name: AchievementsName.HUNDRED_WINS,
      description: AchievementsDescription.HUNDRED_WINS,
      image: AchievementsImage.HUNDRED_WINS,
    })

    const achievement_6 = this.achievementsRepository.create({
      name: AchievementsName.TWO_HUNDRED_WINS,
      description: AchievementsDescription.TWO_HUNDRED_WINS,
      image: AchievementsImage.TWO_HUNDRED_WINS,
    })

    const achievement_7 = this.achievementsRepository.create({
      name: AchievementsName.MIDDLE_PLAYER,
      description: AchievementsDescription.MIDDLE_PLAYER,
      image: AchievementsImage.MIDDLE_PLAYER,
    })

    const achievement_8 = this.achievementsRepository.create({
      name: AchievementsName.HARD_MASTER,
      description: AchievementsDescription.HARD_MASTER,
      image: AchievementsImage.HARD_MASTER,
    })

    const achievement_9 = this.achievementsRepository.create({
      name: AchievementsName.DEFENSE_MASTER,
      description: AchievementsDescription.DEFENSE_MASTER,
      image: AchievementsImage.DEFENSE_MASTER,
    })

    const achievement_10 = this.achievementsRepository.create({
      name: AchievementsName.ALL_TERRAIN,
      description: AchievementsDescription.ALL_TERRAIN,
      image: AchievementsImage.ALL_TERRAIN,
    })

    const achievement_11 = this.achievementsRepository.create({
      name: AchievementsName.DONE,
      description: AchievementsDescription.DONE,
      image: AchievementsImage.DONE,
    })

    const user: User = this.users_repo.create({
      ...create_dto,
      achievements: [],
    })

    user.achievements = [
      achievement_1,
      achievement_2,
      achievement_3,
      achievement_4,
      achievement_5,
      achievement_6,
      achievement_7,
      achievement_8,
      achievement_9,
      achievement_10,
      achievement_11,
    ]

    return this.users_repo.save(user)
  }

  async findDMRelated(user: User): Promise<User[]> {
    return this.users_repo
      .createQueryBuilder('user')
      .where((qb) => {
        const sq = qb
          .subQuery()
          .select('DISTINCT message.author')
          .from(Message, 'message')
          .where('message.target = :me')
          .getQuery()
        return 'user.id IN ' + sq
      })
      .orWhere((qb) => {
        const sq = qb
          .subQuery()
          .select('DISTINCT message.target')
          .from(Message, 'message')
          .where('message.author = :me')
          .getQuery()
        return 'user.id IN ' + sq
      })
      .setParameter('me', user.id)
      .getMany()
  }

  async findAll(): Promise<User[]> {
    return this.users_repo.find()
  }

  findAllWithNameLike(name: string): Promise<User[]> {
    return this.users_repo.find({
      select: ['name'],
      where: { name: Like(`${name}%`) },
    })
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

  public async findOneLadderLevel(userId: number): Promise<number> {
    const user: User = await this.users_repo.findOne(userId, {
      relations: ['players'],
    })

    if (!user) throw new NotFoundException('User not found.')

    return user.ladderLevel
  }

  public async updateAvatar(userId: number, file: any): Promise<User> {
    const path: string = 'http://localhost:8080/api/users/images/' + file
    console.log(path)
    await this.users_repo.update(userId, { avatar: path })

    return await this.users_repo.findOne(userId)
  }

  public async updateLadderLevel(userId: number, level: number): Promise<User> {
    await this.users_repo.update(userId, { ladderLevel: level })

    return await this.users_repo.findOne(userId)
  }

  public async updateAchievements(
    userPlayer: User,
    achievementName: AchievementsName,
  ): Promise<User> {
    const achievement = await this.achievementsRepository
      .createQueryBuilder('achievement')
      .leftJoinAndSelect('achievement.users', 'users')
      .where(`"users"."id" = :id`, { id: userPlayer.id })
      .andWhere(`"achievement"."name" = :name`, { name: achievementName })
      .getOne()
    await this.achievementsRepository.update(achievement.id, { locked: false })

    return await this.users_repo.findOne(userPlayer.id)
  }

  public async updateName(userId: number, name: string): Promise<User> {
    await this.users_repo.update(userId, { name: name })

    return await this.users_repo.findOne(userId)
  }

  public async updateGameInvitation(
    user: User,
    inviteStatus: boolean,
  ): Promise<User> {
    const result = await this.users_repo.update(user.id, {
      game_invitation_pending: inviteStatus,
    })
    return await this.users_repo.findOne(user.id)
  }

  public async updateStatus(user: User, status: string): Promise<void> {
    this.users_repo.update(user.id, { status: status })
  }
}
