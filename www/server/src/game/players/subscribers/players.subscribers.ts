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
import { UsersService, Achievements } from 'src/users/services/users.service';

  
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
    
    afterInsert(event: InsertEvent<Player>) {
      console.log("---------__AFTER INSERT PALYERS-------------")
      if (event.entity.room.players && event.entity.room.players.length == 1) {
        console.log('Locking Room ' + event.entity.room.id)
        this.roomsService.update(event.entity.room.id, {locked: true})
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
      console.log(event.entity);
      if (event.entity.winner) {
        const player: Player = await this.playersService.findOne(event.entity.id)
        console.log(player);
        await this.usersService.updateAchievements(player.user, Achievements.NOVICE)        
      }
    }
  
  }