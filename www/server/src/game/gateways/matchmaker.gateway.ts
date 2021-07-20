import { WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { UsersService } from '../../users/services/users.service';
import { RoomsService } from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';

import { User } from '../../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';


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
    private userService: UsersService,
    private roomsService: RoomsService,
    private playerService: PlayersService,

  ) { }

  @SubscribeMessage('searchMatch')
  async matchmaking(
    @MessageBody() data, // update interface
    @ConnectedSocket() client: Socket,
  ): Promise<Player> {

    console.log('IN MATCHMAKING')
    // Get current user - @GetCurrentUser
    const user: User = await this.userService.findOne(data.userId)
    // Find room that matches the game mode and options 
    const room = await this.roomsService.findMatchOrCreate(data.mode, data.options, user)
    // Create and Add player
    const player = await this.playerService.create(room, user)

    client.emit('redirect-to-room', room.id);
    
    return player
  }

  @SubscribeMessage('checkInGame')
  async checkIfInGame(
    @MessageBody() userId: number
  ): Promise<InGameType> {

    try {
      const user = await this.userService.findOneWithPlayers(userId)
      if (user.players) {
        const activePlayer: Player = user.players.find(player => player.winner === null)
        if (!activePlayer) {
          return {inGame: false, roomRoute: ''}
        }
        const roomId: number = await this.playerService.findRoomNumber(activePlayer.id)
        return {inGame: true, roomRoute: `/game/room/${roomId}`}
      }
    } catch (error) {
      console.log(error.message)
      return {inGame: false, roomRoute: ''}
    }
  }
}