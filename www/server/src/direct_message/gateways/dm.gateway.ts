import { UseGuards }           from "@nestjs/common";
import { ConnectedSocket }     from "@nestjs/websockets";
import { OnGatewayConnection } from "@nestjs/websockets";
import { OnGatewayInit }       from "@nestjs/websockets";
import { OnGatewayDisconnect } from "@nestjs/websockets";
import { SubscribeMessage }    from "@nestjs/websockets";
import { WebSocketGateway }    from "@nestjs/websockets";
import { WebSocketServer }     from "@nestjs/websockets";
import { Socket }              from "socket.io";
import { Server }              from "socket.io";

import { WsJwtGuard } from "src/auth/guards/ws-jwt.guard";
import { AuthUser }   from "src/auth/decorators/auth-user.decorator";
import { User }       from "src/users/entities/user.entity";

import { Message }         from "../messages/entities/message.entity";
import { MessagesService } from "../messages/services/messages.service";

@UseGuards(WsJwtGuard)
@WebSocketGateway({
	namespace: 'dm',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	}
})
export class DMGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	// -------------------------------------------------------------------------
	// Attributes
	// -------------------------------------------------------------------------
	@WebSocketServer()
	private _server: Server;

	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly messages_svc: MessagesService,
	) {}

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	afterInit(
		server: Server,
	)
		: void
	{
		console.log(`DM:Gateway: Initialized.`);
	}

	handleConnection(
		client: Socket,
		...args: any[]
	)
		: void
	{
		console.log(`DM:Gateway: Connection.`);
	}

	handleDisconnect(
		client: Socket,
	)
		: void
	{
		console.log(`DM:Gateway: Disconnect.`);
	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@SubscribeMessage('join')
	handleJoin(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
	)
		: void
	{
		client.join(this.getRoomName(user));

		console.log(`User ${user.id} joined Room ${this.getRoomName(user)}.`);
	}

	@SubscribeMessage('leave')
	handleLeave(
		@ConnectedSocket() client: Socket,
		@AuthUser() user: User,
	)
		: void
	{
		client.leave(this.getRoomName(user));

		console.log(`User ${user.id} left Room ${this.getRoomName(user)}.`);
	}

	sendMessage(
		message: Message,
		)
		: void
	{
		this._server
			.to(this.getRoomName(message.author))
			.to(this.getRoomName(message.target))
			.emit('message', message)
		;

		console.log(`Message sent to ${message.author.id} and ${message.target.id}.`);
	}

	// -------------------------------------------------------------------------
	// Private methods
	// -------------------------------------------------------------------------
	private getRoomName(
		user: User,
	)
		: string
	{
		return `dm_${user.id}`;
	}

}
