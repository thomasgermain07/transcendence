import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room }   from './entities/room.entity';
import { Option } from './entities/option.entity';
import { Player } from '../players/entities/player.entity';

import { RoomsService }     from './services/rooms.service';
import { PurgeService }     from './services/purge.service';
import { PlayersService }   from '../players/services/players.service';
import { RoomsController }  from './controllers/rooms.controller';
import { RoomsSubscriber }  from './subscribers/rooms.subscribers';
import { UsersModule }      from 'src/users/users.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Option, Player]),
    UsersModule,
  ],
  providers: [
    RoomsService,
    PurgeService,
    RoomsSubscriber,
    PlayersService,
  ],
  controllers: [RoomsController],
  exports: [RoomsService]
})
export class RoomsModule {}