import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';

import { Player } from '../entities/player.entity';

import { RoomsService } from '../../rooms/services/rooms.service';
import { GameState} from '../../enum/enum';
import { PlayersService } from '../services/players.service';
import { UsersService } from 'src/users/services/users.service';
import { AchievementsName } from 'src/users/entities/achievement.entity';

  
  @EventSubscriber()
  export class PlayerSubscriber implements EntitySubscriberInterface<Player> {
    constructor(
      connection: Connection,
      private readonly roomsService: RoomsService,
      private readonly usersService: UsersService,
      private readonly playersService: PlayersService
    ) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return Player;
    }
 
    async beforeInsert(event: InsertEvent<Player>) {
      console.log("---------BEFORE INSERT PLAYERS-------------")
      if (event.entity.room.players && event.entity.room.players.length == 1) {
        console.log('Locking Room ' + event.entity.room.id)
        await this.roomsService.update(event.entity.room.id, {locked: true})
      }
    }
  
    async afterRemove(event: RemoveEvent<Player>) {
      console.log(`AFT ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
      if (event.entity?.room?.state === GameState.WAITING) {
        await this.roomsService.update(event.entity.room.id, {locked: false})
      }
    }

    async afterUpdate(event: UpdateEvent<Player>) {
      console.log("---------__AFTER UPDATE PLAYER-------------")
      if (event.entity.winner) {
        const player: Player = await this.playersService.findOne(event.entity.id)
        console.log(player);
        await this.usersService.updateAchievements(player.user, AchievementsName.NOVICE)        
      }
    }
  }