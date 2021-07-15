import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";
import { ConnectedSocket }                   from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { RoomsService }   from '../rooms/services/rooms.service';
import { PlayersService } from '../players/services/players.service';
import { Player }         from '../players/entities/player.entity';
import { Room }           from '../rooms/entities/room.entity';
import UpdateRoomDto      from '../rooms/dto/update-room.dto';


type SocketRoomInfo = {
  playerId: number, // replace number by update player dto?
  room: string,
  roomId: number,
}

type UpdateRoomType = {
  socketRoomName: string,
  roomId: number,
  dto: UpdateRoomDto,
}

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
	namespace: 'game-rooms',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})
export class GameRoomsGateway
{

	@WebSocketServer()
	server: Server;

  constructor(
    private roomsService: RoomsService,
    private playerService: PlayersService,

  ) { }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): string {

    client.join(room);
    // emit to all clients in room except the sender
    client.to(room).emit('roomJoined', room);
    return 'Joined ' + room;
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<string> {

    const roomId = await this.playerService.findRoomNumber(data.playerId)
    // delete player from db
    await this.playerService.remove(data.playerId)
    // remove socket from room
    client.leave(data.room);

    // Update game room for opponent
    const room = await this.roomsService.findOne(roomId)
  
    // TODO: update game room state depending of the situation
  

    this.server.to(data.room).emit('updateRoomInClient', 
      {room: room} )
  
    return 'Player ' + data.playerId + ' deleted';
  }

  @SubscribeMessage('getReady')
  async getReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo
  ): Promise<void> {

      const player: Player = await this.playerService.update(data.playerId, { isReady: true })

      this.server.to(data.room).emit('updateRoomInClient', 
        {room: player.room} )

      client.to(data.room).emit('checkReady',
        {room: player.room} );
  }

  @SubscribeMessage('updateRoomInServer')
  async updateRoom(
    @MessageBody() data: UpdateRoomType
  ): Promise<void> {

      const room: Room = await this.roomsService.update(data.roomId, data.dto)

      this.server.to(data.socketRoomName).emit('updateRoomInClient', 
        {room: room} )
  }

  // TODO: if game end: disconnect all client sockets from game room
}