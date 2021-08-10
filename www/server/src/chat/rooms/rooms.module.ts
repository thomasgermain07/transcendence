import { forwardRef, Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { ChatModule }  from 'src/chat/chat.module';

import { Room }               from './entities/room.entity';
import { RoomsService }       from './services/rooms.service';
import { RoomsController }    from './controllers/rooms.controller';
import { IsUniqueRoomConstraint } from './decorators/is-unique.decorator';
import { ExistsRoomConstraint }   from './decorators/exists.decorator';

@Module({
	imports: [
		// Database
		TypeOrmModule.forFeature([Room]),
		// Modules
		UsersModule,
		forwardRef(() => ChatModule),
	],
	controllers: [
		RoomsController,
	],
	providers: [
		// Services
		RoomsService,
		// Constraints (Validation Decorator)
		IsUniqueRoomConstraint,
		ExistsRoomConstraint,
	],
	exports: [
		// Services
		RoomsService,
		// Constraints (Validation Decorator)
		IsUniqueRoomConstraint,
		ExistsRoomConstraint,
	]
})
export class RoomsModule {}
