import { Module }        from '@nestjs/common';
import { forwardRef }    from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { DMModule }    from 'src/direct_message/dm.module';

import { Message }            from './entities/message.entity';
import { MessagesService }    from './services/messages.service';
import { MessageSubscriber }  from './subscribers/message.subscriber';
import { MessagesController } from './controllers/messages.controller';
import { IgnoredsModule } from 'src/relations/ignoreds/ignoreds.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Message]),
		UsersModule,
		forwardRef(() => DMModule),
		forwardRef(() => IgnoredsModule),
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
