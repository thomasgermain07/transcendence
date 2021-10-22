import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';

import { Friendship } from './entities/friendship.entity';
import { FriendshipsController } from './controllers/friendships.controller';
import { FriendshipsService } from './services/friendships.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friendship]),
		forwardRef(() => UsersModule),
	],
	controllers: [FriendshipsController],
	providers: [FriendshipsService],
	exports: [FriendshipsService],
})
export class FriendshipsModule {}
