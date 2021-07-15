import { Controller, Get, UseGuards } from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Player } from '../entities/player.entity';

import { PlayersService } from '../services/players.service';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';


// @UseGuards(JwtAuthGuard)
@Controller('game/players')
@UseInterceptors(ClassSerializerInterceptor)
export class PlayersController {

    // ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly playersService : PlayersService,
	) {}

    @Get()
    findall(): Promise<Player[]> {
        return this.playersService.findAll()
    }

}