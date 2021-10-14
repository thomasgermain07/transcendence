import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { UsersService } from './services/users.service'
import { UsersController } from './controllers/users.controller'
import { IsUniqueUserConstraint } from './decorators/is-unique.decorator'
import { ExistsUserConstraint } from './decorators/exists.decorator'
import { Achievement } from './entities/achievement.entity'
import { StatsService } from './services/stats.service';
import { UserGateway } from './gateways/user.gateway';
import { FriendshipsModule } from 'src/relations/friendships/friendships.module'
import { UsersSubscriber } from './subscribers/users.subscribers'
import { Room } from 'src/game/rooms/entities/room.entity'
import { Option } from 'src/game/rooms/entities/option.entity'
import { Player } from 'src/game/players/entities/player.entity'
import { GameModule } from 'src/game/game.module'

@Module({
  imports: [
    // Database
    TypeOrmModule.forFeature([User, Achievement, Room, Option, Player]),
    // Modules
    forwardRef(() => FriendshipsModule),
    forwardRef(() => GameModule),
  ],
  controllers: [
    // Controllers
    UsersController,
  ],
  providers: [
    // Gateway
    UserGateway,
    // Services
    UsersService,
    StatsService,
    // Decorators
    IsUniqueUserConstraint,
    ExistsUserConstraint,
    //Subscribers
    UsersSubscriber,
  ],
  exports: [
    // Gateway
    UserGateway,
    // Services
    UsersService,
    // Decorators
    IsUniqueUserConstraint,
    ExistsUserConstraint,
  ],
})
export class UsersModule {}
