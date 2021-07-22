import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { UsersService } from './services/users.service'
import { UsersController } from './controllers/users.controller'
import { IsUniqueUserConstraint } from './decorators/is-unique.decorator'
import { ExistsUserConstraint } from './decorators/exists.decorator'
import { UsersSubscriber } from './subscribers/users.subscribers';

@Module({
  imports: [
    // Database
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    // Controllers
    UsersController,
  ],
  providers: [
    // Services
    UsersService,
    // Decorators
    IsUniqueUserConstraint,
    ExistsUserConstraint,
    // Subscribers
		UsersSubscriber,
  ],
  exports: [
    // Services
    UsersService,
    // Decorators
    IsUniqueUserConstraint,
    ExistsUserConstraint,
  ],
})
export class UsersModule {}
