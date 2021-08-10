import { ConnectedSocket, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "socket.io";

import { ChatService } from "../services/chat.service";
import { Message }     from "../messages/entities/message.entity";

@WebSocketGateway({
	namespace: 'chat',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	}
})
export class ChatGateway
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
		private readonly chat_svc: ChatService,
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
		console.log(`MessagesGateway: Initialized.`);
	}

	handleConnection(
		client: Socket,
		...args: any[]
	)
		: void
	{
		console.log(`MessagesGateway: Connection.`);
	}

	handleDisconnect(
		client: Socket,
	)
		: void
	{
		console.log(`MessagesGateway: Disconnect.`);
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
			// .to(this.getRoomName(message.room.id))
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
		// client.join(this.getRoomName(room_id));
		this._server.emit('message', data);
	}

	// -------------------------------------------------------------------------
	// Privte Methods
	// -------------------------------------------------------------------------
	private getRoomName(
		room_id: number,
	)
		: string
	{
		return `room_${room_id}`;
	}

}
