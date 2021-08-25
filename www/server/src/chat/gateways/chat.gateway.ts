import { UseGuards }           from "@nestjs/common";
import { ConnectedSocket }     from "@nestjs/websockets";
import { MessageBody }         from '@nestjs/websockets'
import { OnGatewayConnection } from "@nestjs/websockets";
import { OnGatewayInit }       from "@nestjs/websockets";
import { OnGatewayDisconnect } from "@nestjs/websockets";
import { SubscribeMessage }    from "@nestjs/websockets";
import { WebSocketGateway }    from "@nestjs/websockets";
import { WebSocketServer }     from "@nestjs/websockets";
import { WsException     }     from "@nestjs/websockets";
import { Socket }              from "socket.io";
import { Server }              from "socket.io";

import { WsJwtGuard }  from "src/auth/guards/ws-jwt.guard";
import { User }        from "src/users/entities/user.entity";
import { AuthUser }    from "src/auth/decorators/auth-user.decorator";

import { ChatService } from '../services/chat.service'
import { Room }        from '../rooms/entities/room.entity'
import { Message }     from '../messages/entities/message.entity'

@UseGuards(WsJwtGuard)
@WebSocketGateway({
	namespace: 'chat',
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@WebSocketServer()
	private _server: Server

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	constructor(
			private readonly chat_svc: ChatService
	) {}

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	afterInit(server: Server): void {
		console.log(`MessagesGateway: Initialized.`)
	}

	handleConnection(client: Socket, ...args: any[]): void {
		console.log(`MessagesGateway: Connection.`)
	}

	handleDisconnect(client: Socket): void {
		console.log(`MessagesGateway: Disconnect.`)
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------
	@SubscribeMessage('join')
	async handleJoin(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: string,
	)
		: Promise<void>
	{
		console.log(`Chat:Gateway:Join`);

		let room: Room = undefined;

		try {
			room = (await this.chat_svc.getRelatedRooms(user))
				.find(room => room.id == JSON.parse(data).room_id)
			;
		}
		catch (e)
		{
			console.log(e);
		}

		if (!room)
			throw new WsException("You are not subscribed to this room.");

		client.join(this.getRoomName(room.id));
	}

	@SubscribeMessage('leave')
	async handleLeave(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
		@MessageBody() data: string,
	)
		: Promise<void>
	{
		try
		{
			console.log(`Chat:Gateway:Leave`);
			client.leave(this.getRoomName(JSON.parse(data).room_id));

			console.log(`User ${user.id} left chat ${this.getRoomName(JSON.parse(data).room_id)}.`);
		}
		catch (e)
		{
			console.log(`Unexpected error.`)
			console.log(e)
		}
	}

	sendMessage(
		message: Message
	)
		: void
	{
		this._server
			.to(this.getRoomName(message.room.id))
			.emit('message', message)
		;
	}

	// -------------------------------------------------------------------------
	// Private Methods
	// -------------------------------------------------------------------------
	private getRoomName(
		room_id: number,
	)
		: string
	{
		return `room_${room_id}`
	}
}
