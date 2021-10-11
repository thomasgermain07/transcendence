import { Controller, Get, Delete, Body, BadRequestException } from '@nestjs/common';
import { UseGuards, Param, ParseIntPipe }              from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Room } from '../entities/room.entity';
import { GameMode } from '../../enum/enum';

import { RoomsService } from '../services/rooms.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from '../../../users/entities/user.entity';


@UseGuards(JwtAuthGuard)
@Controller('game/rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {

    // ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly roomsService : RoomsService,
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

    // TODO: remove this endpoint once all tests are done
    @Get('/delete')
    clear(): void {
        this.roomsService.clearAll()
    }

    @Get(':id')
    findone(@Param('id', ParseIntPipe) id: number): Promise<Room> {
        return this.roomsService.findOne(id)
    }

    @Delete('/private')
    async deletePrivate(
        @AuthUser() user: User,
        @Body('room') room: Room,
    )
    : Promise<void> {

        const check = await this.roomsService.checkIfFromRoom(user, room)
        if (!check || room?.mode != GameMode.PRIVATE) {
            throw new BadRequestException('room cannot be deleted')
        }
        
        return this.roomsService.remove(room)
    }
}
