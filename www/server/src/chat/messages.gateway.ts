import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SubscribeMessage, MessageBody }     from "@nestjs/websockets";

import { Server } from "socket.io";

@WebSocketGateway({
	namespace: 'chat',
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})
export class MessageGateway
{

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleIncoming(
		@MessageBody() data: string
	)
		: void
	{
		this.server.emit('message', data);
	}

}
