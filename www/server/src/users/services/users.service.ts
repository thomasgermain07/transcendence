import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Message } from 'src/direct_message/messages/entities/message.entity';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import {
	Achievement,
	defaultAchievements,
} from '../entities/achievement.entity';
import { AchievementsName } from '../entities/achievement.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly users_repo: Repository<User>,
		@InjectRepository(Achievement)
		private achievementsRepository: Repository<Achievement>,
	) {}

	async turnOnTwoFactorAuthentication(userId: number): Promise<void> {
		await this.users_repo.update(userId, {
			isTwoFactorAuthenticationEnabled: true,
		});
	}

	async turnOffTwoFactorAuthentication(userId: number): Promise<void> {
		await this.users_repo.update(userId, {
			isTwoFactorAuthenticationEnabled: false,
		});
	}

	async setTwoFactorAuthenticationSecret(
		secret: string,
		userId: number,
	): Promise<void> {
		await this.users_repo.update(userId, {
			twoFactorAuthenticationSecret: secret,
		});
	}

	async create(create_dto: CreateUserDto): Promise<User> {
		const user: User = this.users_repo.create({
			...create_dto,
			achievements: [],
		});

		user.achievements = defaultAchievements.map((achievement) =>
			this.achievementsRepository.create({
				name: achievement.name,
				description: achievement.description,
				image: achievement.image,
			}),
		);

		return this.users_repo.save(user);
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
					.getQuery();
				return 'user.id IN ' + sq;
			})
			.orWhere((qb) => {
				const sq = qb
					.subQuery()
					.select('DISTINCT message.target')
					.from(Message, 'message')
					.where('message.author = :me')
					.getQuery();
				return 'user.id IN ' + sq;
			})
			.setParameter('me', user.id)
			.getMany();
	}

	async findAll(): Promise<User[]> {
		return this.users_repo.find();
	}

	findLastWithNameLike(name: string): Promise<User> {
		return this.users_repo.findOne({
			select: ['id'],
			where: { name: Like(`${name}%`) },
			order: {
				id: 'DESC',
			},
		});
	}

	async findOne(data: Object): Promise<User> {
		return this.users_repo.findOne(data);
	}

	async setRefreshToken(user: User, token: string): Promise<void> {
		if (!token) {
			this.users_repo.update(user.id, {
				refresh_token: token,
				status: 'disconnected',
			});
		} else {
			this.users_repo.update(user.id, {
				refresh_token: token,
			});
		}
	}

	async update(user: User, update_dto: UpdateUserDto): Promise<User> {
		const user_update: User = this.users_repo.create(user);
		Object.assign(user_update, update_dto);

		return this.users_repo.save(user_update);
	}

	async remove(user: User): Promise<void> {
		this.users_repo.remove(user);
	}

	public async findOneLadderLevel(userId: number): Promise<number> {
		const user: User = await this.users_repo.findOne(userId, {
			relations: ['players'],
		});

		if (!user) throw new NotFoundException('User not found.');

		return user.ladderLevel;
	}

	public async updateAvatar(userId: number, file: any): Promise<User> {
		const path: string = 'http://localhost:8080/' + file;
		await this.users_repo.update(userId, { avatar: path });

		return await this.users_repo.findOne(userId);
	}

	public async updateLadderLevel(userId: number, level: number): Promise<User> {
		await this.users_repo.update(userId, { ladderLevel: level });

		return await this.users_repo.findOne(userId);
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
			.getOne();
		await this.achievementsRepository.update(achievement.id, { locked: false });

		return await this.users_repo.findOne(userPlayer.id);
	}

	public async updateName(userId: number, name: string): Promise<User> {
		await this.users_repo.update(userId, { name: name });

		return await this.users_repo.findOne(userId);
	}

	public async updateGameInvitation(
		user: User,
		inviteStatus: boolean,
	): Promise<User> {
		const result = await this.users_repo.update(user.id, {
			game_invitation_pending: inviteStatus,
		});
		return await this.users_repo.findOne(user.id);
	}

	public async getUsers(offset?: number, limit?: number): Promise<User[]> {
		const users = await this.users_repo
			.createQueryBuilder('user')
			.orderBy('user.name')
			.offset(offset)
			.limit(limit)
			.getMany();

		return users as any as User[];
	}

	public async getUsersSearch(
		search: string,
		offset?: number,
		limit?: number,
	): Promise<User[]> {
		const users = await this.users_repo
			.createQueryBuilder('user')
			.orderBy('user.name')
			.where('user.name like :name', { name: `${search}%` })
			.offset(offset)
			.limit(limit)
			.getMany();

		return users as any as User[];
	}

	public async updateStatus(user: User, status: string): Promise<void> {
		this.users_repo.update(user.id, { id: user.id, status: status });
	}
}
