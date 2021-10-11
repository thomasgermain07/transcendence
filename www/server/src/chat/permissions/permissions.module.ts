import { forwardRef } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ChatModule } from 'src/chat/chat.module'
import { RoomsModule } from 'src/chat/rooms/rooms.module'
import { SubscriptionsModule } from 'src/chat/subscriptions/subscriptions.module'
import { UsersModule } from 'src/users/users.module'

import { Permission } from './entities/permission.entity'
import { PermissionsController } from './controllers/permissions.controller'
import { PermissionsService } from './services/permissions.service'

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
  controllers: [PermissionsController],
  providers: [
    // Services
    PermissionsService,
  ],
  exports: [
    // Services
    PermissionsService,
  ],
})
export class PermissionsModule {}
