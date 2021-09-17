import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { ParseIntPipe, NotFoundException, Param } from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Player } from '../entities/player.entity';

import { PlayersService } from '../services/players.service';
import { UsersService } from 'src/users/services/users.service';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { InGameType } from 'src/game/type/type';


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

    @Get('checkIfInGameOrQueue/:userId')
    async checkIfInGameOrQueue(@Param('userId', ParseIntPipe) id: number
    ): Promise<InGameType> {
        const user = await this.usersService.findOne(id)
        const player = await this.playersService.checkIfInGame(user)
        if (player) {
          if (!player.room.locked) {
            return { inGame: false, roomRoute: 'matchmaking', player: player }
          } else {
            return {inGame: true, roomRoute: `/game/room/${player.room.id}`, player: player}
          }
        }
        return {inGame: false, roomRoute: '', player: player}
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

    // Delete player
    @Delete(':playerId')
    async removePlayer(
        @Param('playerId', ParseIntPipe) id: number
    ) : Promise<void> {
        await this.playersService.remove(id)
    }
}