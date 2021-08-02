import { ConnectedSocket, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io";

import { Message }         from "../messages/entities/message.entity";
import { MessagesService } from "../messages/services/messages.service";

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
	// Interfaces implementations
	// -------------------------------------------------------------------------
	constructor(
		private readonly messages_svc: MessagesService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Interfaces implementations
	// -------------------------------------------------------------------------
	afterInit(
		server: Server,
	)
		: void
	{
		console.log(`DM:MessagesGateway: Initialized.`);
	}

	handleConnection(
		client: Socket,
		...args: any[]
	)
		: void
	{
		console.log(`DM:MessagesGateway: Connection.`);
	}

	handleDisconnect(
		client: Socket,
	)
		: void
	{
		console.log(`DM:MessagesGateway: Disconnect.`);
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------
	broadcast(
		message: Message,
	)
		: void
	{
		this._server
			// .to(this.getRoomName(message.target.id))
			// .to(this.getRoomName(message.author.id))
			.emit('message', message)
		;
	}

	@SubscribeMessage('message')
	handleMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: string,
	)
		: void
	{
		// client.join(this.getRoomName(user_id));
		this._server.emit('message', data);
	}

	// -------------------------------------------------------------------------
	// Privte Methods
	// -------------------------------------------------------------------------
	private getRoomName(
		target_id: number,
	)
		: string
	{
		return `dm_${target_id}`;
	}

}
