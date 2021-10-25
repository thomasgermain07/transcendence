import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';

import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './services/chat.service';

import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
	imports: [
		forwardRef(() => RoomsModule),
		forwardRef(() => MessagesModule),
		forwardRef(() => SubscriptionsModule),
		forwardRef(() => PermissionsModule),
	],
	controllers: [],
	providers: [ChatService, ChatGateway],
	exports: [ChatService, ChatGateway],
})
export class ChatModule {}
