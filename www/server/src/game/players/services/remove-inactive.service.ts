import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PlayersService } from './players.service';

@Injectable()
export class RemoveInactiveService {
	constructor(private readonly playersService: PlayersService) {}

	private readonly logger = new Logger(RemoveInactiveService.name);

	@Cron('0 */10 * * * *') // every 10 min
	async removeInactivePlayers() {
		this.logger.log('Deleting inactive players');
		const inactivePlayers = await this.playersService.getInactive();

		inactivePlayers.forEach((player) => {
			this.playersService.remove(player.id);
		});
	}
}
