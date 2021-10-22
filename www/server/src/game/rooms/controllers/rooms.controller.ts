import {
	Controller,
	Get,
	Delete,
	Body,
	BadRequestException,
	Post,
} from '@nestjs/common';
import { UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Room } from '../entities/room.entity';
import { GameMode } from '../../enum/enum';

import { RoomsService } from '../services/rooms.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from '../../../users/entities/user.entity';
import { PlayersService } from 'src/game/players/services/players.service';
import MatchmakerDto from 'src/game/gateways/dto/matchmaker.dto';
import { Player } from 'src/game/players/entities/player.entity';
import { UserGateway } from '../../../users/gateways/user.gateway';

@UseGuards(JwtAuthGuard)
@Controller('game/rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
	constructor(
		private readonly roomsService: RoomsService,
		private readonly playersService: PlayersService,
		private readonly user_gtw: UserGateway,
	) {}

	@Get()
	findall(): Promise<Room[]> {
		return this.roomsService.findAll();
	}

	@Get('/duel')
	findAllDuel(): Promise<Room[]> {
		return this.roomsService.findAllByMode(GameMode.DUEL);
	}

	@Get('/ladder')
	findAllLadder(): Promise<Room[]> {
		return this.roomsService.findAllByMode(GameMode.LADDER);
	}

	@Get(':id')
	findone(@Param('id', ParseIntPipe) id: number): Promise<Room> {
		return this.roomsService.findOne(id);
	}

	@Post('matchmaking')
	async handleMatchmaking(
		@AuthUser() user: User,
		@Body() data: MatchmakerDto,
	): Promise<Player> {
		const defaultRange = 3;

		// Check if user is already in a game room
		const inGame = await this.playersService.checkIfInGame(user);
		if (inGame) {
			throw new BadRequestException('You are already in game');
		}

		// Find room that matches the game mode and options
		const room = await this.roomsService.findMatchOrCreate(
			data.mode,
			data.options,
			user,
			defaultRange,
		);

		// Create and Add player
		return await this.playersService.create(room, user);
	}

	@Delete('/private')
	async deletePrivate(
		@AuthUser() user: User,
		@Body('room') room: Room,
	): Promise<void> {
		const check = await this.roomsService.checkIfFromRoom(user, room);
		if (!check || room?.mode != GameMode.PRIVATE) {
			throw new BadRequestException('room cannot be deleted');
		}

		room.players.forEach((player) => {
			if (player.user.status != 'disconnected') {
				this.user_gtw.handleSetStatus(player.user, { status: 'connected' });
			}
		});

		return this.roomsService.remove(room);
	}
}
