import { Controller, Get, UseGuards } from '@nestjs/common';
import { ParseIntPipe, NotFoundException, Param } from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Player } from '../entities/player.entity';

import { PlayersService } from '../services/players.service';
import { UsersService } from 'src/users/services/users.service';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('game/players')
@UseInterceptors(ClassSerializerInterceptor)
export class PlayersController {

    // ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly playersService : PlayersService,
        private readonly usersService : UsersService,
	) {}

    @Get()
    findall(): Promise<Player[]> {
        return this.playersService.findAll()
    }

    @Get('history/:userId')
    async findMatchHistory(
        @Param('userId', ParseIntPipe) id: number
    ): Promise<Player[]> {
        const user = await this.usersService.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return this.playersService.getMatchHistoryByUser(id)
    }

}