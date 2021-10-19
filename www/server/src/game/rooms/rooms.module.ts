import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Room } from './entities/room.entity'
import { Option } from './entities/option.entity'
import { Player } from '../players/entities/player.entity'

import { RoomsService } from './services/rooms.service'
import { PurgeService } from './services/purge.service'
import { PlayersService } from '../players/services/players.service'
import { RoomsController } from './controllers/rooms.controller'
import { RoomsSubscriber } from './subscribers/rooms.subscribers'
import { UsersService } from 'src/users/services/users.service'
import { User } from 'src/users/entities/user.entity'
import { Achievement } from 'src/users/entities/achievement.entity'
import { UsersModule } from '../../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, Room, Option, Player]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    RoomsService,
    PurgeService,
    RoomsSubscriber,
    PlayersService,
    UsersService,
  ],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}