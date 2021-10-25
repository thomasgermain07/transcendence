import { RoomType } from '../chat/room';
import { UserType } from '../user/user';
import { GameOptions } from './gameOptions';

export interface InvitationType {
	gameOptions: GameOptions;
	host: UserType;
	guestId: number;
}

export interface GameInvitationAnswer extends InvitationType {
	reply: string;
	gameRoom: RoomType;
}
