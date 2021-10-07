import { forwardRef, Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/chat/rooms/rooms.module';

import { Permission }            from './entities/permission.entity';
import { PermissionsService }    from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { ChatModule } from '../chat.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

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
		PermissionsService
	],
	exports: [
		// Services
		PermissionsService,
	]
})
export class PermissionsModule {}
