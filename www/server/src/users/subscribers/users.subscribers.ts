import {
	Connection,
	EntitySubscriberInterface,
	EventSubscriber,
	UpdateEvent,
} from 'typeorm';

import { UsersService } from 'src/users/services/users.service';

import { User } from '../entities/user.entity';
import { RoomsService } from 'src/game/rooms/services/rooms.service';
import { Room } from 'src/game/rooms/entities/room.entity';
import { GameRoomsGateway } from 'src/game/gateways/game-rooms.gateway';
import { GameState } from 'src/game/enum/enum';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
	constructor(
		connection: Connection,
		private readonly roomsService: RoomsService,
		private readonly usersService: UsersService,
		private readonly game_rooms_gtw: GameRoomsGateway,
	) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	async afterUpdate(event: UpdateEvent<User>) {
		if (event.entity.id && event.entity.status == 'disconnected') {
			const user: User = await this.usersService.findOne(event.entity.id);
			const rooms: Room[] = await this.roomsService.findAllMatchPlayingByUser(
				user,
			);
			if (rooms && user) {
				rooms.forEach((room: Room) => {
					if (room.state === GameState.OVER) return;
					const room_name: string = this.getRoomName(room.id);
					this.game_rooms_gtw.sendPause({
						move: 'pause',
						user_id: event.entity.id,
						room: room_name,
						roomId: room.id,
					});
				});
			}
		}
	}

	private getRoomName(target_id: number): string {
		return `room-${target_id}`;
	}
}
