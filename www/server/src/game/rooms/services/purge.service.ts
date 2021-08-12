import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RoomsService } from './rooms.service';

@Injectable()
export class PurgeService {
  constructor(
		private readonly roomsService : RoomsService
	) {}

  private readonly logger = new Logger(PurgeService.name);

  @Cron('0 10 * * * *') // every hour, at the start of the 10th minute
  async deleteUnusedRooms() {
    // this.logger.debug('In purge cron job');
    this.logger.log('Deleting unused rooms');
    await this.roomsService.findEmptyAndDelete()
  }
}