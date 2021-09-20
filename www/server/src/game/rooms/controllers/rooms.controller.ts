import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { Param, ParseIntPipe }                         from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Room } from '../entities/room.entity';
import { GameMode } from '../../enum/enum';

import { RoomsService } from '../services/rooms.service';
import { PlayersService } from 'src/game/players/services/players.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import CreateOptionDto from '../dto/create-option.dto';
import { User } from 'src/users/entities/user.entity';


// @UseGuards(JwtAuthGuard)
@Controller('game/rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {

    // ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly roomsService : RoomsService,
        private readonly playersService : PlayersService,
	)
	{
	}

    @Get()
    findall(): Promise<Room[]> {
        return this.roomsService.findAll()
    }
    @Get('/duel')
    findAllDuel(): Promise<Room[]> {
        return this.roomsService.findAllByMode(GameMode.DUEL)
    }
    @Get('/ladder')
    findAllLadder(): Promise<Room[]> {
        return this.roomsService.findAllByMode(GameMode.LADDER)
    }

    // TODO: remove once all tests are done
    @Get('/delete')
    clear(): void {
        this.roomsService.clearAll()
    }

    @Get(':id')
    findone(@Param('id', ParseIntPipe) id: number): Promise<Room> {
        return this.roomsService.findOne(id)
    }

    @Post('private')
    async createPrivate(
        @Body('options') options: CreateOptionDto,
        @Body('host') host: User,
        @Body('guest') guest: User,
    ): Promise<Room> {

        // create empty private room
        let room = await this.roomsService.createPrivate(options)

        // add both players
        try {
            await this.playersService.create(room, host)
            await this.playersService.create(room, guest)
        } catch (error) {
            console.log(error)
            throw new BadRequestException('User does not exist')
        }

        // return room
        return room;
    }
}
