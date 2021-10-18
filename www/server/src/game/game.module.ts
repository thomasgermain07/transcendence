import { Module, forwardRef } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { RoomsModule } from './rooms/rooms.module'
import { PlayersModule } from './players/players.module'

import { MatchmakerGateway } from './gateways/matchmaker.gateway'
import { GameRoomsGateway } from './gateways/game-rooms.gateway'

@Module({
  imports: [forwardRef(() => UsersModule), RoomsModule, PlayersModule],
  exports: [RoomsModule, GameRoomsGateway, PlayersModule],
  providers: [MatchmakerGateway, GameRoomsGateway],
})
export class GameModule {}
