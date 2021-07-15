import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
} from 'typeorm';

import { Player } from '../entities/player.entity';

import { RoomsService } from '../../rooms/services/rooms.service';

  
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
      console.log(`AFTER Player INSERTED: `, event.entity);
      console.log('PLAYERS IN ROOM: ' + event.entity.room?.players.length)
      if (event.entity.room.players && event.entity.room.players.length == 1) {
        console.log('Locking Room ' + event.entity.room.id)
        this.roomsService.update(event.entity.room.id, {locked: true})
      }
    }
  
    afterRemove(event: RemoveEvent<Player>) {
      console.log(`AFT ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
      this.roomsService.update(event.entity.room.id, {locked: false})
    }
  
  }