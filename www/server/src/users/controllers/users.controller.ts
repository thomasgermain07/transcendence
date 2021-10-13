import { Controller, Res }     from '@nestjs/common'
import { Body, Param, Query }  from '@nestjs/common'
import { Get, Post, Patch, Delete } from '@nestjs/common'
import { UseGuards }           from '@nestjs/common'
import { ParseIntPipe }        from '@nestjs/common'
import { ForbiddenException }  from '@nestjs/common'
import { NotFoundException }   from '@nestjs/common'
import { BadRequestException } from '@nestjs/common'
import { UseInterceptors }     from '@nestjs/common'
import { UploadedFile }        from '@nestjs/common'
import { FileInterceptor }     from '@nestjs/platform-express'
import { join }                from 'path'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthUser }     from 'src/auth/decorators/auth-user.decorator'

import { UpdateUserDto } from '../dto/update-user.dto'
import { User }          from '../entities/user.entity'
import { UsersService }  from '../services/users.service'
import { storage, isFileExtensionSafe, removeFile } from '../helpers/image-storage'
import { GameLeaderboard } from '../types/game-leaderboard';
import { StatsService } from '../services/stats.service';
import { GameStatsPerMode, GameStatsTotal } from '../types/game-stats';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  constructor(
    private readonly users_svc: UsersService,
    private readonly stats_svc : StatsService,
  ) {}

  // ---------------------------------------------------------------------------
  // Public methods
  // ---------------------------------------------------------------------------
  @Get()
  async findAll(): Promise<User[]> {
    return this.users_svc.findAll()
  }

  @Get('me')
  async me(@AuthUser() user: User): Promise<User> {
    return user
  }

  // ex: http://localhost:8080/api/users/leaderboard?offset=0&limit=20
  @Get('leaderboard')
  async getLeaderboard(@Query() { offset, limit })
    : Promise<GameLeaderboard>
  {
    return await this.stats_svc.getLeaderboard(offset, limit).catch(err => {
      throw new BadRequestException(err.message)
    })
  }

  @Get('/images/:avatar')
  async findAvatarImage(@Param('avatar') avatar, @Res() res): Promise<Object> {
    console.log("----------_GET IMAGE--------------")
    return res.sendFile(join(process.cwd(), '/images/' + avatar))
  }

  @Get('/achievements/images/:type')
  async findAchievementImage(@Param('type') type, @Res() res): Promise<Object> {
    return res.sendFile(join(process.cwd(), '/assets/achievements-badges/' + type))
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const target: User = await this.users_svc.findOne({
      id: id,
    })

    if (!target) throw new NotFoundException('User not found.')

    return target
  }

  @Get(':id/stats')
	async getUserStats(@Param('id', ParseIntPipe) id: number)
	{
    const user: User = await this.users_svc.findOne(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

		const stats: GameStatsPerMode & GameStatsTotal = await this.stats_svc.getStatsByUser(id)

		return {
      user_id: id,
			user_stats: stats
		}
	}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', storage ))
  async uploadFile(@AuthUser() user: User,
  @UploadedFile() file): Promise<User> {
    console.log("-------_UPLOAD FILE---------")

    const fileName = file?.filename;

    if (!fileName) {
      console.log("!!!!FileNam " + file)
      throw new ForbiddenException('File must be png, jpg/jpeg')
    }

    console.log(file)
    const imagesFolderPath = join(process.cwd(), 'images')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      if (file?.size > 1000000) {
        removeFile(fullImagePath)
        throw new ForbiddenException('Max File Size reached')
      }
      return this.users_svc.updateAvatar(user.id, file.filename);
    }
    removeFile(fullImagePath)
    throw new ForbiddenException('File content does not match extension!')

  }

	@Patch(':id')
	async update(
		@AuthUser() user: User,
		@Body() update_dto: UpdateUserDto,
		@Param('id', ParseIntPipe) id: number,
	)
		: Promise<User>
	{
		const target: User = await this.users_svc.findOne({ id: id });

		if (!target)
			throw new NotFoundException('User not found.');

		if (!this.canModify(user, target))
			throw new ForbiddenException('You can not update this user.');

		// Todo:
		// if (!this.canModifyRole(user))
		// 	delete update_dto.is_admin;

		return this.users_svc.update(target, update_dto);
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const target: User = await this.users_svc.findOne({
      id: id,
    })

    if (!target) throw new NotFoundException('User not found.')

    if (!(await this.canModify(user, target)))
      throw new ForbiddenException('You can not delete this user.')

    this.users_svc.remove(target)
  }

  // -------------------------------------------------------------------------
  // Private methods
  // -------------------------------------------------------------------------
  private async canModify(user: User, target: User): Promise<boolean> {
		// Todo:
      return (/* user.is_admin ||  */user.id === target.id);
  }

  // Todo:
	// private canModifyRole(
	// 	user: User,
	// )
	// 	: boolean
	// {
	// 	return user.is_admin;
	// }

}
