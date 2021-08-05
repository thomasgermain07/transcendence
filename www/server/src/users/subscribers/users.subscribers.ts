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
}