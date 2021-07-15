import { Controller, Get, Delete }                     from '@nestjs/common';
import { Param, ParseIntPipe }                         from '@nestjs/common';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { Room } from '../entities/room.entity';

import { RoomsService } from '../services/rooms.service';



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
