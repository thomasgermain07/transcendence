import { Controller } from '@nestjs/common';
import { Body, Param, Query } from '@nestjs/common';
import { Get, Post, Patch, Delete } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import {
	storage,
	isFileExtensionSafe,
	removeFile,
} from '../helpers/image-storage';
import { GameLeaderboard } from '../types/game-leaderboard';
import { StatsService } from '../services/stats.service';
import { GameStatsPerMode, GameStatsTotal } from '../types/game-stats';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(
		private readonly users_svc: UsersService,
		private readonly stats_svc: StatsService,
	) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.users_svc.findAll();
	}

	@Get('users')
	async getUsers(@Query() { offset, limit, search }): Promise<User[]> {
		if (search) {
			return await this.users_svc
				.getUsersSearch(search, offset, limit)
				.catch((err) => {
					throw new BadRequestException(err.message);
				});
		} else {
			return await this.users_svc.getUsers(offset, limit).catch((err) => {
				throw new BadRequestException(err.message);
			});
		}
	}

	@Get('me')
	async me(@AuthUser() user: User): Promise<User> {
		return user;
	}

	@Get('leaderboard')
	async getLeaderboard(@Query() { offset, limit }): Promise<GameLeaderboard> {
		return await this.stats_svc.getLeaderboard(offset, limit).catch((err) => {
			throw new BadRequestException(err.message);
		});
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
		const target: User = await this.users_svc.findOne({
			id: id,
		});

		if (!target) throw new NotFoundException('User not found.');

		return target;
	}

	@Get(':id/stats')
	async getUserStats(@Param('id', ParseIntPipe) id: number) {
		const user: User = await this.users_svc.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const stats: GameStatsPerMode & GameStatsTotal =
			await this.stats_svc.getStatsByUser(id);

		return {
			user_id: id,
			user_stats: stats,
		};
	}

	@Get(':id/game-invite-pending')
	async getGameInvite(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
		const user: User = await this.users_svc.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user.game_invitation_pending;
	}

	@Post('/upload')
	@UseInterceptors(FileInterceptor('file', storage))
	async uploadFile(
		@AuthUser() user: User,
		@UploadedFile() file,
	): Promise<User> {
		const fileName = file?.filename;

		if (!fileName) {
			throw new ForbiddenException('File must be png, jpg/jpeg');
		}

		const imagesFolderPath = join(process.cwd(), 'public');
		const fullImagePath = join(imagesFolderPath + '/' + file.filename);
		if (await isFileExtensionSafe(fullImagePath)) {
			if (file?.size > 1000000) {
				removeFile(fullImagePath);
				throw new ForbiddenException('Max File Size reached');
			}
			const oldAvatarPath = user.avatar.slice(22);
			const oldImagePath = join(imagesFolderPath + '/' + oldAvatarPath);
			if (oldAvatarPath != 'no-avatar.png') {
				removeFile(oldImagePath);
			}
			return this.users_svc.updateAvatar(user.id, file.filename);
		}
		removeFile(fullImagePath);
		throw new ForbiddenException('File content does not match extension!');
	}

	@Patch(':id')
	async update(
		@AuthUser() user: User,
		@Body() update_dto: UpdateUserDto,
		@Param('id', ParseIntPipe) id: number,
	): Promise<User> {
		const target: User = await this.users_svc.findOne({ id: id });

		if (!target) throw new NotFoundException('User not found.');

		if (!this.canModify(user, target))
			throw new ForbiddenException('You can not update this user.');

		return this.users_svc.update(target, update_dto);
	}

	@Delete(':id')
	async remove(
		@AuthUser() user: User,
		@Param('id', ParseIntPipe) id: number,
	): Promise<void> {
		const target: User = await this.users_svc.findOne({
			id: id,
		});

		if (!target) throw new NotFoundException('User not found.');

		if (!(await this.canModify(user, target)))
			throw new ForbiddenException('You can not delete this user.');

		this.users_svc.remove(target);
	}

	private async canModify(user: User, target: User): Promise<boolean> {
		return user.id === target.id;
	}
}
