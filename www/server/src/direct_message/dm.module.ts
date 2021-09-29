import { Module } from '@nestjs/common'

import { UsersModule } from 'src/users/users.module'

import { MessagesModule } from './messages/messages.module'
import { RoomsModule } from 'src/game/rooms/rooms.module'
import { PlayersModule } from '../game/players/players.module'
import { DMGateway } from './gateways/dm.gateway'
import { DMService } from './services/dm.service'
import { DMController } from './controllers/dm.controller'
import { IgnoredsModule } from 'src/relations/ignoreds/ignoreds.module'

@Module({
  imports: [
    // Modules
    UsersModule,
    MessagesModule,
    IgnoredsModule,
    RoomsModule,
    PlayersModule,
  ],
  controllers: [DMController],
  providers: [
    // Services
    DMService,
    // Gateways
    DMGateway,
  ],
  exports: [
    // Services
    DMService,
    // Gateways
    DMGateway,
  ],
})
export class DMModule {}
