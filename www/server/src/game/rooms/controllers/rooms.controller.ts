import { Controller, Get, Delete, Post, Body }                     from '@nestjs/common';
import { Param, ParseIntPipe }                         from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Room, GameMode } from '../entities/room.entity';

import { RoomsService } from '../services/rooms.service';
import CreateRoomDto from '../dto/create-room.dto';




// @UseGuards(JwtAuthGuard)
@Controller('game/rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {

    // ---------------------------------------------------------------------------
	// Constructor
	// ---------------------------------------------------------------------------
	constructor(
		private readonly roomsService : RoomsService
	)
	{
	}

    @Get()
    findall(): Promise<Room[]> {
        return this.roomsService.findAll()
    }

    @Get('/watch')
    findAllByMode(): Promise<Room[]> {
        return this.roomsService.findAllByMode()
        // return this.roomsService.findAll()
    }

    @Get(':id')
    findone(@Param('id', ParseIntPipe) id: number): Promise<Room> {
        return this.roomsService.findOne(id)
    }

    // @Post()
    // create(@Body() roomDto: CreateRoomDto): Promise<Room> {
    //     return this.roomsService.create(roomDto)
    // }

    // @Put(':id')
    // update(@Param('id', ParseIntPipe) id: number, @Body() roomDto: UpdateRoomDto): Promise<Room> {
    //     return this.roomsService.update(id, roomDto)
    // }

    @Delete()
    clear(): void {
        this.roomsService.clearAll()
    }
}
