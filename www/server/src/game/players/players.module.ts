import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../../users/users.module';

import { Player } from './entities/player.entity';

import { PlayersController } from './controllers/players.controller';
import { PlayerSubscriber }  from './subscribers/players.subscribers';
import { PlayersService }    from './services/players.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    RoomsModule,
    UsersModule
  ],
  controllers: [PlayersController],
  providers: [PlayersService, PlayerSubscriber],
  exports: [PlayersService]
})
export class PlayersModule {}