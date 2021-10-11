import UpdateRoomDto      from '../rooms/dto/update-room.dto';
import { User } from '../../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';

export type SocketRoomInfo = {
	playerId: number, // replace number by update player dto?
	room: string,
	roomId: number,
}
  
export type UpdateRoomType = {
	socketRoomName: string,
	roomId: number,
	dto: UpdateRoomDto,
}

export type Move = {
	room: string;
	move: string;
	user_id: number;
}

export type Pause = {
	room: string;
	move: string;
	user_id: number;
	roomId: number
}

export type InGameType = {
	inGame: boolean,
	roomRoute: string,
	player: Player
}

export type expandRangeType = {
	user: User,
	player: Player,
	currentRoomName: string,
	range: number,
}