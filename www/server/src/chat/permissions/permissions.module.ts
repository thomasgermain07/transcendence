import { forwardRef }    from '@nestjs/common';
import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatModule }          from 'src/chat/chat.module';
import { RoomsModule }         from 'src/chat/rooms/rooms.module';
import { SubscriptionsModule } from 'src/chat/subscriptions/subscriptions.module';
import { UsersModule }         from 'src/users/users.module';

import { Permission }            from './entities/permission.entity';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService }    from './services/permissions.service';
import { PermissionSubscriber }  from './subscribers/permission.subscriber';

@Module({
	imports: [
		// Database
		TypeOrmModule.forFeature([Permission]),
		// Modules
		UsersModule,
		forwardRef(() => ChatModule),
		RoomsModule,
		forwardRef(() => SubscriptionsModule),
	],
	controllers: [
		PermissionsController,
	],
	providers: [
		// Services
		PermissionsService,
		// Subscribers
		PermissionSubscriber,
	],
	exports: [
		// Services
		PermissionsService,
		// Subscribers
		PermissionSubscriber,
	]
})
export class PermissionsModule {}
