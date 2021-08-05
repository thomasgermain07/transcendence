import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
  
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    connection: Connection,
    private readonly usersService: UsersService
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
    const maxLadderLevel = await this.usersService.getMaxLadderLevel()
    console.log('MAX LADDER LEVEL: ' + maxLadderLevel)
    await this.usersService.updateLadderLevel(event.entity.id, maxLadderLevel + 1)
    // await this.usersService.updateLadderLevel(event.entity.id, 50)
  }

}