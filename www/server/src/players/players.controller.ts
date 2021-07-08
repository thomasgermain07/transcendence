import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param } from '@nestjs/common'
import JwtAuthGuard from 'src/auth/jwt-auth.guard'
import { PlayersService } from './players.service'
import { CreatePlayerDto } from './dto/create-player.dto'
import  RequestWithUser  from '../auth/request-with-user.interface'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // route to test if auth is working
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPlayer(@Body() createplayerdto: CreatePlayerDto, @Req() req: RequestWithUser) {
    return this.playersService.createPlayer(createplayerdto, req.user);
  }

  @Get(':userid')
  @UseGuards(JwtAuthGuard)
  async getPlayers(@Param('userid') userid: number) {
    return this.playersService.getPlayers(userid);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPlayerById(@Param('id') id: number) {
    return this.playersService.getPlayerById(id);
  }

  @Delete(':id')
	remove(
		@Param('id') id: number
	)
	{
		return this.playersService.remove(id);
	}

}