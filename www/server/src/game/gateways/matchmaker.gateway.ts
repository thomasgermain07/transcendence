import { WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, WsException }     from "@nestjs/websockets";

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { ValidationPipe, UsePipes } from '@nestjs/common';

import { RoomsService } from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';

import { User } from '../../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';

import MatchmakerDto from './dto/matchmaker.dto';
import { InGameType, SocketRoomInfo, expandRangeType } from '../type/type';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';


@UseGuards(WsJwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
	namespace: 'matchmaker',
})
export class MatchmakerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	@WebSocketServer()
	server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly playerService: PlayersService,

  ) { }

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	afterInit(server: Server): void {
		console.log(`Matchmaker:Gateway: Initialized.`)
	}

	handleConnection(client: Socket, ...args: any[]): void {
		console.log(`Matchmaker:Gateway: Connection.`)
    console.log(client.id)
	}

	handleDisconnect(client: Socket): void {
		console.log(`Matchmaker:Gateway: Disconnect.`)
	}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('searchMatch')
  async matchmaking(
    @MessageBody() data: MatchmakerDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Player | void> {

    const defaultRange = 3
    
    // Check if user is already in a game room
    const inGame = await this.playerService.checkIfInGame(data.user)
    if (inGame) {
      return inGame
    }

    // Find room that matches the game mode and options 
    const room = await this.roomsService.findMatchOrCreate(data.mode, data.options, data.user, defaultRange)
    
    // Create and Add player
    const player = await this.playerService.create(room, data.user)

    // Open matchmaking lobby
    client.emit('joinLobbyInClient', player);

  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('checkInGame')
  async checkIfInGame(
    @MessageBody() user: User
  ): Promise<InGameType> {
    
    const player = await this.playerService.checkIfInGame(user)
    if (player) {
      if (!player.room.locked) {
        return { inGame: false, roomRoute: 'matchmaking', player: player }
      } else {
        return {inGame: true, roomRoute: `/game/room/${player.room.id}`, player: player}
      }
    }
    return {inGame: false, roomRoute: '', player: player}
  }


  @SubscribeMessage('joinLobbyInServer')
  async handleLobbyJoin(
    @MessageBody() data: SocketRoomInfo,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {

    client.join(data.room);

    const matchFound = await this.roomsService.checkIfMatchFound(data.roomId)
    if (matchFound) {
      this.server.to(data.room).emit('matchFound')
    }

    return 'Joined ' + data.room;
  }

  @SubscribeMessage('leaveLobbySocket')
  async handleLeaveLobbyTest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo,
  ): Promise<string> {

    // remove socket from room
    client.leave(data.room);
  
    return 'Player ' + data.playerId + ' deleted';
  }

  @SubscribeMessage('leaveLobbyInServer')
  async handleLeaveLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo,
  ): Promise<string> {

    // delete player from db
    await this.playerService.remove(data.playerId)

    // remove socket from room
    client.leave(data.room);

    // send info to other player
    this.server.to(data.room).emit('opponentLeaving')
  
    return 'Player ' + data.playerId + ' deleted';
  }

  @SubscribeMessage('expandSearchRange')
  async handleExpand(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: expandRangeType,
  ): Promise<Player> {

    let player = data.player

    const room = await this.roomsService.findMatchOnLadder(data.user, data.range)

    // if new room != current room: del player from current room and join new room
    const currentRoomId = data.player.room.id
    if (room && currentRoomId != room.id) {
      await this.playerService.remove(data.player.id)
      client.leave(data.currentRoomName);
      
      player = await this.playerService.create(room, data.user)
      client.emit('joinLobbyInClient', player);
    }

    return player
  }

  @SubscribeMessage('renewSearchDuel')
  async handleRenewSearchDuel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: expandRangeType,
  ): Promise<Player> {

    let player = data.player

    const room = await this.roomsService.findMatchOnDuel(player.room.option)

    const currentRoomId = data.player.room.id
    if (room && currentRoomId != room.id) {
      await this.playerService.remove(data.player.id)
      client.leave(data.currentRoomName);
      
      player = await this.playerService.create(room, data.user)
      client.emit('joinLobbyInClient', player);
    }

    return player
  }

}