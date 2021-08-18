import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from "src/users/users.module";

import { Friendship }            from "./entities/friendship.entity";
import { FriendshipsController } from "./controllers/friendships.controller";
import { FriendshipsService }    from "./services/friendships.service";

@Module({
	imports: [
		// Database
		TypeOrmModule.forFeature([Friendship]),
		// Module
		UsersModule,
	],
	controllers: [
		FriendshipsController,
	],
	providers: [
		// Services
		FriendshipsService,
	],
	exports: [
		// Services
		FriendshipsService,
	]
})
export class FriendshipsModule {}
