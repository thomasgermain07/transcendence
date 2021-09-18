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

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'dm',
})
export class DMGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------
  @WebSocketServer()
  private _server: Server

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    private readonly ignoreds_svc: IgnoredsService,
  ) {}

  // -------------------------------------------------------------------------
  // Interfaces implementations
  // -------------------------------------------------------------------------
  afterInit(server: Server): void {
    console.log(`DM:Gateway: Initialized.`)
  }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`DM:Gateway: Connection.`)
  }

  handleDisconnect(client: Socket): void {
    console.log(`DM:Gateway: Disconnect.`)
  }

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @AuthUser() user: User): void {
    client.join(this.getRoomName(user))

    console.log(`User ${user.id} joined Room ${this.getRoomName(user)}.`)
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @AuthUser() user: User): void {
    client.leave(this.getRoomName(user))

    console.log(`User ${user.id} left Room ${this.getRoomName(user)}.`)
  }

  async sendMessage(message: Message): Promise<void> {
    const ignoreds: Ignored[] = await this.ignoreds_svc.findAll(message.target);

    let targets = this._server.to(this.getRoomName(message.author));

    if (!ignoreds.some((ignored) => ignored.target.id === message.author.id))
      targets = targets.to(this.getRoomName(message.target));

    targets.emit('message', message);

    console.log(`DM:Message sent to ${message.author.id} and ${message.target.id}.`)
  }

  // -------------------------------------------------------------------------
  // Private methods
  // -------------------------------------------------------------------------
  private getRoomName(user: User): string {
    return `dm_${user.id}`
  }
}
