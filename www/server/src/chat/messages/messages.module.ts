import { Module }        from '@nestjs/common';
import { forwardRef }    from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/chat/rooms/rooms.module';

import { Message }            from './entities/message.entity';
import { MessagesService }    from './services/messages.service';
import { MessageSubscriber }  from './subscribers/message.subscriber';
import { MessagesController } from './controllers/messages.controller';
import { ChatModule }         from '../chat.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Message]),
		UsersModule,
		forwardRef(() => ChatModule),
		RoomsModule,
	],
	controllers: [
		MessagesController,
	],
	providers: [
		MessagesService,
		MessageSubscriber,
	],
	exports: [
		MessagesService,
	]
})
export class MessagesModule {}
