import { UseGuards } from '@nestjs/common'
import { ConnectedSocket } from '@nestjs/websockets'
import { OnGatewayConnection } from '@nestjs/websockets'
import { OnGatewayInit } from '@nestjs/websockets'
import { OnGatewayDisconnect } from '@nestjs/websockets'
import { SubscribeMessage } from '@nestjs/websockets'
import { WebSocketGateway } from '@nestjs/websockets'
import { WebSocketServer } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'

import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard'
import { AuthUser } from 'src/auth/decorators/auth-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { Ignored } from 'src/relations/ignoreds/entities/ignored.entity'
import { IgnoredsService } from 'src/relations/ignoreds/services/ignoreds.service'

import { Message } from '../messages/entities/message.entity'

import { Option } from 'src/game/rooms/entities/option.entity'
import { Room } from 'src/game/rooms/entities/room.entity'

interface GameInvitation {
  host: User,
  guestId: number,
  gameOptions: Option,
}

interface GameInvitationAnswer extends GameInvitation {
  reply: string,
  gameRoom?: Room,
}

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'dm',
})
export class DMGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private _server: Server

  constructor(
    private readonly ignoreds_svc: IgnoredsService,
  ) {}

  afterInit(server: Server): void {
  }

  handleConnection(client: Socket, ...args: any[]): void {
    if (!client.handshake?.headers?.cookie) {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket): void {
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @AuthUser() user: User): void {
    client.join(this.getRoomName(user))

  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @AuthUser() user: User): void {
    client.leave(this.getRoomName(user))

  }

  async sendMessage(message: Message): Promise<void> {
    const ignoreds: Ignored[] = await this.ignoreds_svc.findAll(message.target);

    let targets = this._server.to(this.getRoomName(message.author));

    if (!ignoreds.some((ignored) => ignored.target.id === message.author.id))
      targets = targets.to(this.getRoomName(message.target));

    targets.emit('message', message);
  }

  sendGameInvitation(invitation: GameInvitation): void {
    this._server
      .to(`dm_${invitation.guestId}`)
      .emit('gameInvitationReceived', invitation)
  }

  answerGameInvitation(answer: GameInvitationAnswer): void {
    this._server
      .to(this.getRoomName(answer.host))
      .emit('gameInvitationAnswered', answer)

  }

  private getRoomName(user: User): string {
    return `dm_${user.id}`
  }
}
