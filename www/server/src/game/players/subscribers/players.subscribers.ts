import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
} from 'typeorm';

import { Player } from '../entities/player.entity';

import { RoomsService } from '../../rooms/services/rooms.service';
import { GameState } from '../../rooms/entities/room.entity';

  
  @EventSubscriber()
  export class PlayerSubscriber implements EntitySubscriberInterface<Player> {
    constructor(
      connection: Connection,
      private readonly roomsService: RoomsService
    ) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return Player;
    }
    
    afterInsert(event: InsertEvent<Player>) {
      if (event.entity.room.players && event.entity.room.players.length == 1) {
        console.log('Locking Room ' + event.entity.room.id)
        this.roomsService.update(event.entity.room.id, {locked: true})
      }
    }
  
    async afterRemove(event: RemoveEvent<Player>) {
      console.log(`AFT ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
      if (event.entity.room.state === GameState.WAITING) {
        await this.roomsService.update(event.entity.room.id, {locked: false})
      }
    }
  
  }