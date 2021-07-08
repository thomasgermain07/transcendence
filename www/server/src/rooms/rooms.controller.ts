import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common'
import JwtAuthGuard from 'src/auth/jwt-auth.guard'
import { RoomsService } from './rooms.service'
import { CreateRoomDto } from './dto/create-room.dto'
import  RequestWithUser  from '../auth/request-with-user.interface'
import Player from 'src/players/entities/player.entity'

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // route to test if auth is working
  @Post()
  @UseGuards(JwtAuthGuard)
  async createRoom(@Body() createroomdto: CreateRoomDto, @Req() req: RequestWithUser) {
    return this.roomsService.createRoom(createroomdto, req.user);
  }

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   async getRoomsByStatus(@Req() req: Player) {
//       console.log("gdddgfddfdfgdfdfdf")
//     return this.roomsService.getRoomsByStatus(req);
//   }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRoomById(@Param('id') id: number) {
    return this.roomsService.getRoomById(id);
  }
}