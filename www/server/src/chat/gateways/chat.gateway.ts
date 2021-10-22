import { UseGuards } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';

import { ChatService } from '../services/chat.service';
import { Room } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/services/rooms.service';
import { Message } from '../messages/entities/message.entity';
import { Permission } from '../permissions/entities/permission.entity';

type JoinLeaveType = {
	room_id: number;
};

@UseGuards(WsJwtGuard)
@WebSocketGateway({
	namespace: 'chat',
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private _server: Server;

	constructor(
		private readonly chat_svc: ChatService,
		private readonly rooms_svc: RoomsService,
	) {}

	afterInit(server: Server): void {}

	handleConnection(client: Socket, ...args: any[]): void {
		if (!client.handshake?.headers?.cookie) {
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket): void {}

	@SubscribeMessage('join')
	async handleJoin(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: JoinLeaveType,
	): Promise<void> {
		const room: Room = await this.rooms_svc.findOne({ id: data.room_id });

		if (
			!room ||
			(!(await this.chat_svc.isSubscribed(user, room)) &&
				!(await this.chat_svc.isOwner(user, room)))
		) {
			throw new WsException('You are not subscribed to this room.');
		}

		const room_name: string = this.getRoomName(room.id);

		client.join(room_name);

		this._server
			.to(room_name)
			.emit('info', { type: 'join', username: user.name });
	}

	@SubscribeMessage('leave')
	async handleLeave(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: JoinLeaveType,
	): Promise<void> {
		const room_name: string = this.getRoomName(data.room_id);

		client.leave(room_name);

		this._server
			.to(room_name)
			.emit('info', { type: 'leave', username: user.name });
	}

	sendMessage(message: Message): void {
		const room_name: string = this.getRoomName(message.room.id);

		this._server.to(room_name).emit('message', message);
	}

	setPermission(permission: Permission): void {
		const room_name: string = this.getRoomName(permission.room.id);

		this._server.to(room_name).emit('set_permission', permission);
	}

	removePermission(permission: Permission): void {
		const room_name: string = this.getRoomName(permission.room.id);

		this._server.to(room_name).emit('remove_permission', permission);
	}

	private getRoomName(room_id: number): string {
		return `room_${room_id}`;
	}
}
