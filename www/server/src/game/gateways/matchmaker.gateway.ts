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
  // roomId: number,
  player: Player
}

type LobbyInfoType = {
  roomName: string,
  roomId: number,
  playerId: number,
}

type expandRangeType = {
  user: User,
  player: Player,
  currentRoomName: string,
  range: number,
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
    const player = await this.playerService.create(room, data.user)

    // client.emit('redirect-to-room', room.id);
    // client.emit('joinLobbyInClient', { roomId: room.id, playerId: player.id });
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
    @MessageBody() data: LobbyInfoType,
    // @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {

    console.log('IN JOIN LOBBY')
    // console.log(roomName)
    console.log(data)

    // const roomName = data.room
    client.join(data.roomName);

    // // emit to all clients in room except the sender
    // client.to(data.roomName).emit('opponentJoined');

    // OR check if match found
    const matchFound = await this.roomsService.checkIfMatchFound(data.roomId)
    console.log('Match found: ' + matchFound)
    if (matchFound) {
      console.log('MATCHMAKER ROOM LOCKED')
      this.server.to(data.roomName).emit('matchFound')
    }

    return 'Joined ' + data.roomName;
  }

  @SubscribeMessage('leaveLobbyInServer')
  async handleLeaveLobby(
    @ConnectedSocket() client: Socket,
    // @MessageBody() data: SocketRoomInfo,
    @MessageBody() data: LobbyInfoType,
  ): Promise<string> {

    console.log('IN LEAVE LOBBY ')
    // console.log(data)

    // delete player from db
    await this.playerService.remove(data.playerId)

    // remove socket from room
    client.leave(data.roomName);

    // send info to other player
    this.server.to(data.roomName).emit('opponentLeaving')
  
    return 'Player ' + data.playerId + ' deleted';
  }

  @SubscribeMessage('expandSearchRange')
  async handleExpand(
    @ConnectedSocket() client: Socket,
    // @MessageBody() data: SocketRoomInfo,
    @MessageBody() data: expandRangeType,
  ) {
  // ): Promise<string> {

    console.log('IN EXPAND SEARCH ')
    console.log(data)

    let player = data.player

    // call new searchMatchOnLadder(range)
    const room = await this.roomsService.expandSearchLadder(data.range, data.user)
    console.log(room)

    // if new room id != current room id : leave current room id + join new room id
    const currentRoomId = data.player.room.id
    if (currentRoomId != room.id) {
      console.log('IN EXPAND CHANGE LOBBY')
      // leave room and del player from previous room
      await this.playerService.remove(data.player.id)
      client.leave(data.currentRoomName);
      
      // join new room and add player to new room
      player = await this.playerService.create(room, data.user)
      client.emit('joinLobbyInClient', player);
    }

    return player
  }

}