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
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { FriendshipsService } from 'src/relations/friendships/services/friendships.service';

import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { PlayersService } from 'src/game/players/services/players.service';

type JoinLeaveType = {
	target_id: number;
};

type SetStatusType = {
	status: string;
};

@UseGuards(WsJwtGuard)
@WebSocketGateway({
	namespace: 'user',
})
export class UserGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private _server: Server;

	constructor(
		private readonly users_svc: UsersService,
		private readonly friendships_svc: FriendshipsService,
		private readonly players_svc: PlayersService,
	) {}

	afterInit(server: Server): void {}

	handleConnection(client: Socket, ...args: any[]): void {
		if (!client.handshake?.headers?.cookie) {
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket): void {
		const user: User = client['user'];
		const room_name: string = this.getRoomName(user?.id);

		if (user) {
			client.leave(room_name);

			this.handleSetStatus(user, { status: 'disconnected' });
		}
	}

	@SubscribeMessage('join')
	async handleJoin(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: JoinLeaveType,
	): Promise<void> {
		const target: User = await this.users_svc.findOne({ id: data.target_id });

		if (!target) {
			throw new WsException('Target not found.');
		}

		const is_friend: boolean = (
			await this.friendships_svc.findAllOrWithAccepted(user, true)
		).some(
			(friendship) =>
				friendship.user.id === target.id || friendship.target.id === target.id,
		);
		if (user.id != target.id && !is_friend) {
			throw new WsException('You cannot listen to this user.');
		}

		const room_name: string = this.getRoomName(target.id);

		client.join(room_name);

		const inGame = await this.players_svc.checkIfInGame(user);
		const status = inGame ? 'ingame' : 'connected';

		if (user.id === target.id) this.handleSetStatus(user, { status: status });
	}

	@SubscribeMessage('leave')
	async handleLeave(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: JoinLeaveType,
	): Promise<void> {
		const room_name: string = this.getRoomName(data.target_id);

		client.leave(room_name);
	}

	@SubscribeMessage('set_status')
	async handleSetStatus(
		@AuthUser() user: User,
		@MessageBody() data: SetStatusType,
	): Promise<void> {
		const room_name: string = this.getRoomName(user.id);

		this._server.to(room_name).emit('set_status', {
			user_id: user.id,
			status: data.status,
		});

		await this.users_svc.updateStatus(user, data.status);
	}

	private getRoomName(target_id: number): string {
		return `user_${target_id}`;
	}
}
