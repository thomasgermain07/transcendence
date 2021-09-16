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

@Module({
  imports: [
    // Database
    TypeOrmModule.forFeature([User, Achievement]),
    // Modules
		forwardRef(() => FriendshipsModule),
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
