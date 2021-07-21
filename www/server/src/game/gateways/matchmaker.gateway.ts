import { WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, WsException }     from "@nestjs/websockets";

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ValidationPipe, UsePipes } from '@nestjs/common';

import { RoomsService } from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';

import { User } from '../../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';

import MatchmakerDto from './dto/matchmaker.dto';


type InGameType = {
  inGame: boolean,
  roomRoute: string,
}

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
	namespace: 'matchmaker',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})
export class MatchmakerGateway
{

	@WebSocketServer()
	server: Server;

  constructor(
    private roomsService: RoomsService,
    private playerService: PlayersService,

  ) { }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('searchMatch')
  async matchmaking(
    @MessageBody() data: MatchmakerDto, // user, mode, options
    @ConnectedSocket() client: Socket,
  ): Promise<Player | void> {

    console.log('IN MATCHMAKING')

    // Check if user is already in a game room
    const inGame = await this.playerService.checkIfInGame(data.user)
    if (inGame) {
      return inGame
    }

    // Find room that matches the game mode and options 
    const room = await this.roomsService.findMatchOrCreate(data.mode, data.options, data.user)
    
    // Create and Add player
    await this.playerService.create(room, data.user)
    
    client.emit('redirect-to-room', room.id);

  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('checkInGame')
  async checkIfInGame(
    @MessageBody() user: User
  ): Promise<InGameType> {

    const player = await this.playerService.checkIfInGame(user)
    if (player) {
      return {inGame: true, roomRoute: `/game/room/${player.room.id}`}
    }
    return {inGame: false, roomRoute: ''}
  }
}