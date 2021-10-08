import { forwardRef, Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/chat/rooms/rooms.module';

import { Subscription }            from './entities/subscription.entity';
import { SubscriptionsService }    from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { ChatModule } from '../chat.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
	imports: [
		// Database
		TypeOrmModule.forFeature([Subscription]),
		// Modules
		UsersModule,
		forwardRef(() => ChatModule),
		RoomsModule,
		forwardRef(() => PermissionsModule),
	],
	controllers: [
		SubscriptionsController,
	],
	providers: [
		// Services
		SubscriptionsService,
	],
	exports: [
		// Services
		SubscriptionsService,
	]
})
export class SubscriptionsModule {}
