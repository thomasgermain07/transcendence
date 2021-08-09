import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlayersService } from './players.service';
import { MatchmakerGateway } from '../../gateways/matchmaker.gateway';

@Injectable()
export class RemoveInactiveService {
  constructor(
		private readonly playersService : PlayersService,
    // private readonly matchmakerGateway: MatchmakerGateway
	) {}

  private readonly logger = new Logger(RemoveInactiveService.name);

  // @Cron('30 * * * * *') // every 10 min
  @Cron('0 */10 * * * *') // every 10 min
  async removeInactivePlayers() {
    this.logger.log('Deleting inactive players');
    const inactivePlayers = await this.playersService.getInactive()
    
    inactivePlayers.forEach(player => {
      // const roomName = `lobby-${player.room.id}`
      this.playersService.remove(player.id)
      // this.matchmakerGateway.server.emit('closeLobbyModal')
    });

  }
}