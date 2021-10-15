import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { SubscribeMessage, MessageBody } from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import {
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common'

import { RoomsService } from '../rooms/services/rooms.service'
import { PlayersService } from '../players/services/players.service'
import { Player } from '../players/entities/player.entity'
import { SocketRoomInfo, expandRangeType } from '../type/type'
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard'

@UseGuards(WsJwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  namespace: 'matchmaker',
})
export class MatchmakerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  constructor(
    private readonly roomsService: RoomsService,
    private readonly playerService: PlayersService,
  ) {}

  // -------------------------------------------------------------------------
  // Interfaces implementations
  // -------------------------------------------------------------------------
  afterInit(server: Server): void {
    console.log(`Matchmaker:Gateway: Initialized.`)
  }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Matchmaker:Gateway: Connection.`)
    if (!client.handshake?.headers?.cookie) {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Matchmaker:Gateway: Disconnect.`)
  }

  @SubscribeMessage('joinLobbyInServer')
  async handleLobbyJoin(
    @MessageBody() data: SocketRoomInfo,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    client.join(data.room)

    const matchFound = await this.roomsService.checkIfMatchFound(data.roomId)
    if (matchFound) {
      this.server.to(data.room).emit('matchFound')
    }
    return 'Joined ' + data.room
  }

  @SubscribeMessage('leaveLobbySocket')
  async handleLeaveLobbySocket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo,
  ): Promise<string> {
    client.leave(data.room)
    return 'Player ' + data.playerId + ' deleted'
  }

  @SubscribeMessage('leaveLobbyInServer')
  async handleLeaveLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketRoomInfo,
  ): Promise<string> {
    client.leave(data.room)
    this.server.to(data.room).emit('opponentLeaving')
    return 'Player ' + data.playerId + ' deleted'
  }

  @SubscribeMessage('expandSearchRange')
  async handleExpand(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: expandRangeType,
  ): Promise<Player> {
    let player = data.player
    const currentRoomId = data.player.room.id

    const currentRoom = await this.roomsService.findOne(currentRoomId)
    if (currentRoom.locked) {
      return player
    }
    const room = await this.roomsService.findMatchOnLadder(
      data.user,
      data.range,
    )

    // if new room != current room: del player from current room and join new room
    if (room && currentRoomId != room.id) {
      await this.roomsService.update(room.id, { locked: true })

      await this.playerService.remove(data.player.id)
      client.leave(data.currentRoomName)

      player = await this.playerService.create(room, data.user)
      client.emit('joinLobbyInClient', player)
    }

    return player
  }

  @SubscribeMessage('renewSearchDuel')
  async handleRenewSearchDuel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: expandRangeType,
  ): Promise<Player> {
    let player = data.player
    const currentRoomId = data.player.room.id

    const currentRoom = await this.roomsService.findOne(currentRoomId)
    if (currentRoom.locked) {
      return player
    }

    const room = await this.roomsService.findMatchOnDuel(player.room.option)

    if (room && currentRoomId != room.id) {
      await this.roomsService.update(room.id, { locked: true })

      await this.playerService.remove(data.player.id)
      client.leave(data.currentRoomName)

      player = await this.playerService.create(room, data.user)
      client.emit('joinLobbyInClient', player)
    }

    return player
  }
}
